'use strict'
// var path = require('path');
var wx = require('../wx/index');
// var wechatApi = wx.getWechat();
var Animation=require('../app/api/animation')


exports.reply = function*(next) {
	var message = this.weixin;
	console.log(message)
	if (message.MsgType === 'event') {

		console.log('event')
		if (message.Event === 'subscribe') {
			this.body = '欢迎关注漫迷微信微信公众测试号=^_^=\n '+
									'主人，各式各样的福利在这儿等着您呦~\n '+
									'回复文字或语音搜索您想要搜索的动漫~(≧▽≦)/~\n\n'+
									'回复数字1 查看历史图文推荐\n'+
									'回复数字2 查看热搜动漫排行榜\n'+
									'回复数字3 查看cosplay福利\n\n'+
									'也 可以进入<a href="'+wx.wechatOptions.wechat.baseUrl+'">首页</a>指导一下哦(๑`･ᴗ･´๑)';
		} else if (message.Event === 'unsubscribe') {
			console.log('取消订阅');
			this.body = '';
		} else if (message.Event === 'LOCATION') {
			this.body = '您上报的位置：' + message.Latitude + '/' + message.Longitude + '\n精度：' + message.Precision
		} else if (message.Event === 'CLICK') {
				var news=[];
				if(message.EventKey==='animation_hot'){
					let aniamtions= yield Animation.findHostAnimation(1,5);
					aniamtions.forEach(function(animate){
						news.push({
							title:animate.title,
							description:animate.title,
							picUrl:wx.wechatOptions.wechat.baseUrl+'/upload/'+animate.poster,
							url:wx.wechatOptions.wechat.baseUrl+'/wechat/jump/'+animate._id
						})
					})
				}else if(message.EventKey==='animation_cold'){
					let aniamtions= yield Animation.findHostAnimation(-1,5);
					aniamtions.forEach(function(animate){
						news.push({
							title:animate.title,
							description:animate.title,
							picUrl:wx.wechatOptions.wechat.baseUrl+'/upload/'+animate.poster,
							url:wx.wechatOptions.wechat.baseUrl+'/wechat/jump/'+animate._id
						})
					})
				}
				this.body=news;
		} else if (message.Event === 'SCAN') {
			//用户已经关注时的事件推送
			console.log('SCAN：' + message.EventKey + '    ' + message.Ticket);
			this.body = '看到你扫了一下哦';
		}
		//一下菜单推送事件
		else if (message.Event === 'VIEW') {
			this.body = '您点击了菜单中的链接：' + message.EventKey;
		} else if (message.Event === 'scancode_push') {
			console.log(message.ScanCodeInfo.ScanResult);
			console.log(message.ScanCodeInfo.ScanType);
			this.body = '扫码推送事件：' + message.EventKey;
		} else if (message.Event === 'scancode_waitmsg') {
			console.log(message.ScanCodeInfo.ScanResult);
			console.log(message.ScanCodeInfo.ScanType);
			this.body = '扫码推事件且弹出“消息接收中”提示框' + message.EventKey;
		} else if (message.Event === 'pic_sysphoto') {
			console.log(message.SendPicsInfo.PicList);
			console.log(message.SendPicsInfo.Count);
			this.body = '系统拍照' + message.EventKey;
		} else if (message.Event === 'pic_photo_or_album') {
			console.log(message.SendPicsInfo.PicList);
			console.log(message.SendPicsInfo.Count);
			this.body = '弹出拍照或者相册发图' + message.EventKey;
		} else if (message.Event === 'pic_weixin') {
			console.log(message.SendPicsInfo.PicList);
			console.log(message.SendPicsInfo.Count);
			this.body = 'pic_weixin' + message.EventKey;
		} else if (message.Event === 'location_select') {
			console.log(message.SendLocationInfo.Location_X);
			console.log(message.SendLocationInfo.Location_Y);
			console.log(message.SendLocationInfo.Scale);
			console.log(message.SendLocationInfo.Label);
			console.log(message.SendLocationInfo.Poiname);

			this.body = 'location_select' + message.EventKey;
		}

	} else if (message.MsgType === 'text') {
		var content = message.Content;
		var reply = '哦 ，你说的 ' + content + ' 奴家听不懂';
		//回复特定数字给你相应回复
		if (content === '1') {
			reply = '11111111';
		} else {
			reply=yield findAnimation(content);		
		}
		this.body = reply;
	} else if(message.MsgType === 'voice'){
		var reply='yuyin';
		var voiceText=message.Recognition;
		var voice=voiceText.replace('。','');
		console.log('语音识别:'+voice);
		reply=yield findAnimation(voice);
		this.body=reply;
	}

	yield next;
}
function* findAnimation(content){
	var reply;
	var animations =yield Animation.searchByName(content);
	//如果数据库没有查到，到豆瓣去查
	if(!animations ||animations.length===0){
	
		animations=yield Animation.searchByDouban(content);
	}
	if(animations&&animations.length>0){
		reply=[];
		//数组字段如果过长则无法提供服务,假定最多推送6个
		animations=animations.slice(0,6);
		animations.forEach(function(animate){
			reply.push({
				title:animate.title,
				description:animate.title,
				picUrl:wx.wechatOptions.wechat.baseUrl+'/upload/'+animate.poster,
				url:wx.wechatOptions.wechat.baseUrl+'/wechat/jump/'+animate._id
			})
		})
	}else{
		reply='没有查询到与 '+content+' 相关动漫哦亲~(≧▽≦)/~'
	}
	return reply;
}