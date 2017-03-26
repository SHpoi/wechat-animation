'use strict'
var wx = require('../../wx/index');
var util=require('../../libs/util');
var Animation=require('../api/animation');
var koa_request=require('koa-request');
var mongoose = require('mongoose');
var User = require('../models/user');
var Comment = require('../models/comment');
var options=wx.wechatOptions.wechat;

exports.guess=function *(next){
	var wechatApi = wx.getWechat();
	var data=yield wechatApi.fetchAccessToken();
	var access_token=data.access_token;
	var ticketData=yield wechatApi.fetchTicket(access_token);
	var ticket=ticketData.ticket;
	var params=util.sign(ticket,this.href);

	yield this.render('wechat/game', params);
}

exports.find=function *(next){
	var wechatApi = wx.getWechat();
	var code = this.query.code
  var openUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + options.appID + '&secret=' + options.appSecret + '&code=' + code + '&grant_type=authorization_code'

  var response = yield koa_request({url: openUrl});
  var body = JSON.parse(response.body);

  var openid = body.openid;
 	if(openid){
 		this.session.openid=openid;
 	}else{
 		openid=this.session.openid;
 	}

  var user = yield User.findOne({openid: openid}).exec();
  var name= yield wechatApi.fetchUsers(openid);
  if (!user) {
    user = new User({
      openid: openid,
      password: 'zsa123456',
      name: name.nickname
    })

    user = yield user.save()
  }

  this.session.user = user
  this.state.user = user



  var id = this.params.id
  
  var data = yield wechatApi.fetchAccessToken();
  var access_token = data.access_token
  var ticketData = yield wechatApi.fetchTicket(access_token);
  var ticket = ticketData.ticket
  var url = this.href;
  var params = util.sign(ticket, url)
  var animation = yield Animation.searchById(id);
  var comments = yield Comment
    .find({animation: id})
    .populate('from', 'name')
    .populate('reply.from reply.to', 'name')
    .limit(2)
    .exec()
  comments.countNum=2;
  params.animation = animation
  params.comments = comments

  //love 觉得应该还有更好的办法
  var lovearr=user.love;
  params.love=false;
  for(var i=0;i<lovearr.length;i++){
    if(lovearr[i]==id ){
      params.love=true;
    }
  }
  params.user=user;
  yield this.render('wechat/animation', params)
}

exports.jump = function *(next) {
  var animateId = this.params.id
  var redirect = encodeURIComponent(options.baseUrl + '/wechat/animation/' + animateId)
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + options.appID + '&redirect_uri=' + redirect + '&response_type=code&scope=snsapi_base&state=' + animateId + '#wechat_redirect'

  this.redirect(url)
}
// exports.jumpToIndex = function *(next) {
//   var redirect = encodeURIComponent(options.baseUrl)
//   var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + options.appID + '&redirect_uri=' + redirect + '&response_type=code&scope=snsapi_base#wechat_redirect'
//   this.redirect(url)
// }

