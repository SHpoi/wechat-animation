'use strict'
var mongoose=require('mongoose');
var Animation = require('../models/animation.js');
var Category = require('../models/category.js');
var Promise=require('bluebird');
var co=require('co');
var _=require('lodash');
var koa_request=require('koa-request');
var request=Promise.promisify(require('request'));
var animationSuggest=require('../../wx/index.js').wechatOptions.Animationsuggest;
exports.findAll = function *() {
    var categories= yield Category
        .find({})
        .populate({
            path: 'animations',
            select: 'title poster',
            options: {
                limit: 6
            }
        })
        .exec();
    return categories;
}

exports.getSuggest=function *(){
  var reArr=[]
  for(var i=0;i<animationSuggest.length;i++){
    var k=yield searchByName(animationSuggest[i]);
    if(k && k.length>0 ){
      reArr.push(k[0]);
    }
  }
  return reArr;
}
exports.randomSix=function *(){
    var animations= yield Animation.find({}).exec();
    var len=animations.length;
    var suggestArr;
    if(len>=6){
      suggestArr=getArrayItems(animations,6);
    }else{
      suggestArr=animations;
    }
    return suggestArr;
}
function getArrayItems(arr, num) {
    //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
    var temp_array = new Array();
    for (var index in arr) {
        temp_array.push(arr[index]);
    }
    //取出的数值项,保存在此数组
    var return_array = new Array();
    for (var i = 0; i<num; i++) {
        //判断如果数组还有可以取出的元素,以防下标越界
        if (temp_array.length>0) {
            //在数组中产生一个随机索引
            var arrIndex = Math.floor(Math.random()*temp_array.length);
            //将此随机索引的对应的数组元素值复制出来
            return_array[i] = temp_array[arrIndex];
            //然后删掉此索引的数组元素,这时候temp_array变为新的数组
            temp_array.splice(arrIndex, 1);
        } else {
            //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
            break;
        }
    }
    return return_array;
}
exports.sarchByCategory=function *(catId){
    // var categories= yield Category
    //     .find({_id:catId})
    //         .populate({
    //             path: 'animations',
    //             select: 'title poster'
    //         })
    //         .exec();
    // return categories;
}
exports.searchGenres=function *(g){
  var animations= yield Animation
       .find({'genres':g}).exec();
    return animations;
}
function* searchByName (q){
  var animations= yield Animation
       .find({
                title: new RegExp(q + '.*', 'i')
            })
            .exec();
    return animations;
}
exports.searchByName=searchByName; 
exports.findHostAnimation=function *(hot,num){
    var animations= yield Animation
       .find()
       .sort({'pv':hot})
       .limit(num)
       .exec();
    return animations;
}
exports.searchById=function *(id){
    var animation= yield Animation
           .findOne({ _id:id})
           .exec();
    return animation;
}
function updateAnimation(movie) {
  var options = {
    url: 'https://api.douban.com/v2/movie/subject/' + movie.doubanId,
    json: true
  }

  request(options).then(function(response) {
    var data = response.body;
    if(!data.countries){
    	data.countries=['国籍未知'];
    }
    _.extend(movie, {
      country: data.countries[0] ,
      language: data.language || '外星语',
      summary: data.summary || '暂无简介'
    })


    var genres = movie.genres

    if (genres && genres.length > 0) {
      var cateArray = []

      genres.forEach(function(genre) {
        cateArray.push(function *() {
          var cat = yield Category.findOne({name: genre}).exec()

          if (cat) {
            cat.movies.push(movie._id)
            yield cat.save()
          }
          else {
            cat = new Category({
              name: genre,
              movies: [movie._id]
            })

            cat = yield cat.save()
            movie.category = cat._id
            yield movie.save()
          }
        })
      })
      //在普通的函数体里面怎么调用一个生成期函数数组
      //用同步的方式编写异步的代码
      co(function *() {
        yield cateArray
      })
    }
    else {
      movie.save()
    }
  })
}
exports.searchByDouban=function *(q){
    var options={
        url:'https://api.douban.com/v2/movie/search?q='+encodeURIComponent(q)
    } 
    var response =yield koa_request(options);
    var data=JSON.parse(response.body);
    console.log(data)
    var subjects=[];
    var animations = [];
    if(data && data.subjects){
        subjects=data.subjects;
    }
    if(subjects.length>0){
        var queryArray = [];
        subjects.forEach(function(item){
            queryArray.push(function *(){
                var animation=yield Animation.findOne({
                    doubanId:item.id
                })
                if(animation){
                    animations.push(animation)
                }else{

                    var directors=item.directors;
                    var director=directors[0]||[{name:'作者不祥'}];

                    animation = new Animation({
                        director: director.name || '',
                        title: item.title,
                        original_title:item.original_title|| item.title,
                        doubanId: item.id,
                        doubanRating:item.rating.average,
                        poster: item.images.large,
                        year: item.year,
                        genres: item.genres || []
                      })

                      animation = yield animation.save()
                      animations.push(animation)
                }
            })
        })
        yield queryArray;
        animations.forEach(function(anima) {
          updateAnimation(anima)
        })
    }
    return animations;
}
