'use strict'
var mongoose=require('mongoose');
var Movie = require('../models/movie.js');
var Category = require('../models/category.js');
var Promise=require('bluebird');
var co=require('co');
var _=require('lodash');
var koa_request=require('koa-request');
var request=Promise.promisify(require('request'));

exports.findAll = function *() {
    var categories= yield Category
        .find({})
        .populate({
            path: 'movies',
            select: 'title poster',
            options: {
                limit: 6
            }
        })
        .exec();
    return categories;
}
exports.sarchByCategory=function *(catId){
    var categories= yield Category
        .find({_id:catId})
            .populate({
                path: 'movies',
                select: 'title poster'
            })
            .exec();
    return categories;
}
exports.searchByName=function *(q){
    var movies= yield Movie
       .find({
                title: new RegExp(q + '.*', 'i')
            })
            .exec();
    return movies;
}
exports.searchById=function *(id){
    var movie= yield Movie
           .findOne({ _id:id})
           .exec();
    return movie;
}
function updateMovies(movie) {
  var options = {
    url: 'https://api.douban.com/v2/movie/subject/' + movie.doubanId,
    json: true
  }

  request(options).then(function(response) {
    var data = response.body;

    _.extend(movie, {
      country: data.countries[0],
      language: data.language,
      summary: data.summary
    })

    console.log(data)

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
    var subjects=[];
    var movies = [];
    if(data && data.subjects){
        subjects=data.subjects;
    }
    if(subjects.length>0){
        var queryArray = [];
        subjects.forEach(function(item){
            queryArray.push(function *(){
                var movie=yield Movie.findOne({
                    doubanId:item.id
                })
                if(movie){
                    movies.push(movie)
                }else{

                    var directors=item.directors;
                    var director=directors[0]||[{name:'作者不祥'}];

                    movie = new Movie({
                        director: director.name || '',
                        title: item.title,
                        doubanId: item.id,
                        poster: item.images.large,
                        year: item.year,
                        genres: item.genres || []
                      })

                      movie = yield movie.save()
                      movies.push(movie)
                }
            })
        })
        yield queryArray;
        movies.forEach(function(movie) {
          updateMovies(movie)
        })
    }
    return movies;
}
