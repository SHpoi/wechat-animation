'use strict'

var mongoose = require('mongoose')
var Animation = mongoose.model('Animation');
var User = mongoose.model('User');
var Category = require('../models/category');
var Comment = require('../models/comment');
var _ = require('lodash')
var path = require('path')

var request = require('request');
var fs=require('fs');

// detail page
exports.detail = function*(next) {
  var id = this.params.id
  if (id !== 'undefined') {
    yield Animation.update({
      _id: id
    }, {
      $inc: {
        pv: 1
      }
    }).exec()

    var movie = yield Animation.findOne({
      _id: id
    }).exec()
    var comments = yield Comment
      .find({
        movie: id
      })
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .exec()

    yield this.render('pages/detail', {
      title: 'imooc 详情页',
      movie: movie,
      comments: comments
    })
  }
}


exports.index = function*(next) {
  yield this.render('server-page/index',{name:this.session.user.name})
}
exports.addNewAnimation = function*(next) {
  var _id = this.query._id;
  if (_id) {
    var animation = yield Animation.findOne({
      _id: _id
    }).exec();
    yield this.render('server-page/animationAdd', {
      _id: animation._id,
      title: animation.title,
      tag: animation.genres,
      director: animation.director,
      country: animation.country,
      language: animation.language,
      year: animation.year,
      rating: animation.doubanRating,
      poster: animation.poster,
      episodeList: animation.episode,
      summary: animation.summary
    })
  } else {
    yield this.render('server-page/animationAdd')
  }
}
exports.listPage = function*(next) {
  yield this.render('server-page/animationsList')
}

exports.backlist = function*(next) {
  var q = this.query.search || '';
  var animations;
  if (q) {
    animations = yield Animation.find({
      "title": eval("/" + q + "/i")
    }).exec();
  } else {
    animations = yield Animation.find({}).limit(50).exec();
  }
  this.body = {
    'animations': animations
  };
}

var util = require('../../libs/util')

exports.catchPicInNet = function*(next) {
  var self=this;
  var src=this.query.src;
  var _id=this.params._id;
 
  var animation = yield Animation.findOne({
    _id: _id
  });
  if (animation) {

    var name=Date.now()+'.png';
    var newPath = path.join(__dirname, '../views/dist/upload', name)
    request(src).pipe(fs.createWriteStream(newPath));
    try {
      var animation = yield Animation.update({
        _id: _id
      }, {
        "$set": {
          "poster": name
        }
      });
    } catch (e) {
      this.body = {
        code: 201
      }
      return;
    }
    this.body = {
      code: 200
    };
  }
}

// admin poster
exports.savePoster = function*(next) {
  var posterData = this.request.body.files.file;
  var filePath = posterData.path;
  var name = posterData.name;
  var _id = this.params._id;
  //本地的图片上传并保存
  if (name && _id) {
    var data = yield util.readFileAsync(filePath)
    var timestamp = Date.now()
    var type = posterData.type.split('/')[1]
    var poster = timestamp + '.' + type
    var newPath = path.join(__dirname, '../views/dist/upload', poster)

    yield util.writeFileAsync(newPath, data);
    try {
      var animation = yield Animation.update({
        _id: _id
      }, {
        "$set": {
          "poster": poster
        }
      });
    } catch (e) {
      this.body = {
        code: 201
      }
      return;
    }
  }
  this.body = {
    code: 200
  };
}

// admin post movie
exports.save = function*(next) {
  var body = this.request.body;
  var animationObj = JSON.parse(body.animation);
  var _animate;
  var _id = this.query._id;
  if (_id) {
    //已经有该动漫
    var animate = yield Animation.findOne({
      _id: _id
    }).exec();
    //先删除旧有图片
    var oldposter=animate.poster;
    fs.unlink(path.join(__dirname, '../views/dist/upload', animate.poster),function(){
      console.log('删除'+oldposter);
    });

    _animate = _.extend(animate, animationObj)
    yield _animate.save();
    this.body = {
      success: 3,
      message: '修改成功',
      _id: _animate._id
    };
  } else {
    //检测是否该动漫已经存在
    var search = yield Animation.findOne({
      title: animationObj.title
    }).exec()
    if (search !== null) {
      this.body = {
        success: 2,
        message: '已经存在同名动漫',
        _id: search._id
      };
    } else {
      _animate = new Animation(animationObj);
      yield _animate.save();

      this.body = {
        success: 1,
        message: '创建成功',
        _id: _animate._id
      };
    }
  }
}



exports.del = function*(next) {
  var _id = this.params._id
  console.log('haha')
  if (_id) {
    try {
      var animation=yield Animation.findOne({
        _id: _id
      }).exec();
      if(animation){
        fs.unlink(path.join(__dirname, '../views/dist/upload', animation.poster),function(){});
        var animation=yield Animation.remove({
          _id: _id
        }).exec();
        this.body = {
          success: 1
        }
        
      }
      
    } catch (err) {
      this.body = {
        success: 0
      }
    }
  }
}

exports.love=function *(){
  var animationId=this.query.ani_id;
  var islove=this.query.love;
  var userId=this.query.user_id;
  var user=yield User.findOne({_id:userId}).exec();
  if(islove==1){
    if(user.love.indexOf(animationId)==-1){
      user.love.push(animationId)
    }
  }else if(islove==0){
    var index=user.love.indexOf(animationId);
    if(index!=-1){
      user.love.splice(index,1);
    }
  }
  yield user.save();
  this.body={success:1}
}