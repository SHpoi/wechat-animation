'use strict'

var mongoose = require('mongoose')
var User = mongoose.model('User')

// signup
// exports.showSignup = function *(next) {
//   yield this.render('pages/signup', {
//     title: '注册页面'
//   })
// }

exports.showSignin = function *(next) {
  yield this.render('server-page/log')
}

// exports.signup = function *(next) {
//   var _user = this.request.body.user

//   var user = yield User.findOne({name: _user.name}).exec()

//   if (user) {
//     this.redirect('/signin')

//     return next
//   }
//   else {
//     user = new User(_user)
//     yield user.save()

//     this.session.user = user

//     this.redirect('/')
//   }
// }

// signin
exports.signin = function *(next) {
  var _user = this.request.body.user
  var name = _user.name;
  var password = _user.password;
  var user = yield User.findOne({name: name}).exec()
  if (!user) {
    this.body={message:'没有此用户',success:0};
    return;
  }
  if(user.role<=10){
    this.body={message:'权限不够',success:0};
    return;
  }
  var isMatch;
  if(password===user.password){
    isMatch=true;
  }
  
  if (isMatch) {
    this.session.user = user;
    this.body={message:'登录成功',success:1};
  }
  else {
    this.body={message:'密码错误',success:0};
  }
}

// logout
exports.logout = function *(next) {
  delete this.session.user
  //delete app.locals.user

  this.body={code:200};
}

// userlist page
exports.list = function *(next) {
  var users = yield User
    .find({})
    .sort('meta.updateAt')
    .exec()

  yield this.render('server-page/userList', {
    users: users
  })
}
//返回用户列表
exports.backlist=function*(next){
  var q=this.query.search || '';
  var users;
  if(q){  
    users = yield User.find({"name" :eval("/"+q+"/i")}).exec();
    if(users.length==0){
      users = yield User.find({"openid" :eval("/"+q+"/i")}).exec();
    }
  }else{
    users = yield User.find({}).exec();
  }
  this.body={'users':users};
}
//删除用户
exports.del=function *(next){
  var _id=this.query._id;
  if (_id) {
    try {
      yield User.remove({
        _id: _id
      }).exec()

      this.body = {
        success: 1
      }
    } catch (err) {
      this.body = {
        success: 2
      }
    }
  }
}

// midware for user
exports.signinRequired = function *(next) {
  var user = this.session.user
  console.log(user)
  if (!user) {
    this.redirect('/user/login');
  }
  else {
    yield next
  }
}

exports.adminRequired = function *(next) {
  var user = this.session.user;
  if(!user){
    this.redirect('/user/login');
    return;
  }
  if (!user.role ||user.role <= 10) {
    this.redirect('/user/login');
    return;
  }
  else {
    yield next
  }
}
