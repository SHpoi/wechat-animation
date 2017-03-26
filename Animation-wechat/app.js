
'use strict'
//执行 ngrok -config=ngrok.cfg -subdomain sunqixiong123 8000
//./ngrok -authtoken 2bcwCdsuRcr2cSh2onbdZ_53sZK5kDDHGqXv2tyrBPV
//lt --port 8000
//c724370399d9843e
var Koa = require('koa');
var path = require('path');
var fs=require('fs');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var views = require('koa-views');
var session=require('koa-session');
var Router=require('koa-router');
var serve = require('koa-static');
var game=require('./app/controllers/game');
var wechat=require('./app/controllers/wechat');
var moment=require('moment');
var router=new Router();
var bodyParser=require('koa-bodyparser');
// var session = require('express-session');
// var mongoStore=require('connect-mongo')(session);

var dbUrl='mongodb://localhost/animation';
mongoose.connect(dbUrl);
mongoose.connection.on('connected', function() {
  console.log('Connection success!');
});
var User=require('./app/models/user');

var menu = require('./wx/menu');
var wx = require('./wx/index');
var wechatApi = wx.getWechat();

wechatApi.deleteMenu()
	.then(function() {
		return wechatApi.createMenu(menu);
	})
	.then(function(msg) {
		console.log(msg);
	})

var app = new Koa();
app.use(views(__dirname + '/app/views', {
  extension: 'jade',
  locals: {
    moment: moment,
    baseurl:wx.wechatOptions.wechat.baseUrl
  }
}));
app.use(serve(__dirname + '/app/views/dist'));

app.keys=['imooc'];
app.use(session(app));
app.use(bodyParser());

require('./config/routes')(router);

app.use(function *(next){
	var user=this.session.user;
	if(user && user._id){
		this.session.user=yield User.findOne({_id:user._id}).exec();
		this.state.user=this.session.user;
	}else{
		this.state.user=null;
	}
	yield next;
})

app
	.use(router.routes())
	.use(router.allowedMethods());

// app.use(wechat(wx.wechatOptions.wechat, reply.reply));

app.listen(8000);