'use strict'
var sha1 = require('sha1');
var getRawBody = require('raw-body');
var Wechat = require('./wechat');
var util = require('./util');

module.exports = function(opts,handler) {
  var wechat = new Wechat(opts);

  return function*(next) {
    var token = opts.token,
      signature = this.query.signature,
      nonce = this.query.nonce,
      timestamp = this.query.timestamp,
      echostr = this.query.echostr,
      str = [token, timestamp, nonce].sort().join(''),
      sha = sha1(str),
      that = this;
    if (this.method === 'GET') {
      if (sha === signature) {
        this.body = echostr + '';
      } else {
        this.body = 'wrong';
      }
    } else if (this.method === 'POST') {
      if (sha !== signature) {
        this.body = 'wrong';
        return false;
      }
      var data = yield getRawBody(this.req, {
        length: this.length,
        limit: '1mb',
        encoding: this.charset
      });
      var content = yield util.parseXMLAsync(data);
      // console.log(content)
      var message = util.formatMessage(content.xml);
      // console.log(message)
      this.weixin=message;

      yield handler.call(this,next);
      
      wechat.reply.call(this)
    }
  }
}