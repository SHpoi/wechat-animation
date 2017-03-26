'use strict'

var path=require('path');
var util=require('../libs/util');
var Wechat=require('../wechat/wechat');
var wechat_file=path.join(__dirname,'../config/wechat.txt');
var wechat_ticket_file=path.join(__dirname,'../config/wechat_ticket.txt');
var config={
	Animationsuggest:['来自新世界','你的名字','舰队','替身','黑子的篮球','clannad'],
	wechat:{
		appID:'wx46fcd895bde3d3a2',
		appSecret:'a95261889faa030874f6d3602b46c982',
		token:'imoocisareallyamzingplacetolearn',
		baseUrl:'http://sunqixiong123.ngrok.cc',
		getAccessToken:function(){
			return util.readFileAsync(wechat_file);
		},
		saveAccessToken:function(data){
			data=JSON.stringify(data);
			return util.writeFileAsync(wechat_file,data);
		},
		getTicket:function(){
			return util.readFileAsync(wechat_ticket_file);
		},
		saveTicket:function(data){ 
			data=JSON.stringify(data);
			return util.writeFileAsync(wechat_ticket_file,data);
		}
	}
}
exports.wechatOptions=config;

exports.getWechat=function(){
	var wechatApi = new Wechat(config.wechat);
	return wechatApi;
}