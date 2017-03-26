'use strict'

var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');

// comment
exports.save = function *(next) {
  var _comment = this.request.body.comment
  var movieId = _comment.animation

  if (_comment.cid) {
    let comment = yield Comment.findOne({
      _id: _comment.cid
    }).exec()

    var reply = {
      from: _comment.from,
      to: _comment.tid,
      content: _comment.content
    }

    comment.reply.push(reply)
    yield comment.save()

    this.body = {success: 1}
  }
  else {
    console.log(_comment);
    let comment = new Comment({
      animation: _comment.animation,
      from: _comment.from,
      content: _comment.content
    })

    yield comment.save()
    this.body = {success: 1}
  }
}

exports.searchCommentByStart = function *(next) {
  var _comment = this.request.body.comment;
  console.log('拿到ajax 的 comment请求了');
  var comments = yield Comment
      .find({animation: _comment.animation})
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .skip(+_comment.start)
      .limit(10)
      .exec();
  console.log(comments);
  this.body = {success: 1,Searchcomments:comments}
}
