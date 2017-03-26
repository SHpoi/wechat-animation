'use strict'
var wx=require('./index');
module.exports = {
	'button': [{
		'name': '首页',
		'type': 'view',
		'url':wx.wechatOptions.wechat.baseUrl
	}, {
		'name': '排行榜',
		'sub_button': [{
			'name': '热度前五',
			'type': 'click',
			'key': 'animation_hot'
		}, {
			'name': '年度冷番',
			'type': 'click',
			'key': 'animation_cold'
		}]
	},{
		'name': '历史推送',
		'type': 'view',
		'url':'http://sunqixiong123.tunnel.2bdata.com/history'
	}]
}