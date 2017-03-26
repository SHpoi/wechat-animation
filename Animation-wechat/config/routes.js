'use strict'
var Index = require('../app/controllers/index.js');
var Animation=require('../app/controllers/animation.js')
var User = require('../app/controllers/user.js');
var Comment = require('../app/controllers/comment.js');
var Category = require('../app/controllers/category.js');
var Game=require('../app/controllers/game.js');
var Wechat=require('../app/controllers/wechat');
var koabody=require('koa-body');
module.exports = function(router) {


    router.get('/wechat/jump/:id',Game.jump);
    router.get('/wechat/animation/:id',Game.find);
    router.post('/wechat/animationlove',Animation.love);
    router.get('/wx',Wechat.hear);
    router.post('/wx',Wechat.hear);

    //移动端页面
    router.get('/', Index.index);
    router.post('/search/word',Index.backword);
    router.get('/search/list',Index.list);
    router.post('/search/animation',Index.searchList);


    //首页以及动画操作页
    router.get('/admin/index',User.adminRequired,Animation.index);
    router.get('/admin/animationList',User.adminRequired,Animation.listPage);
    router.get('/admin/inputNewAnimation',User.adminRequired,Animation.addNewAnimation);
    //动画ajax路由
    router.post('/admin/backAnimations',User.adminRequired,Animation.backlist);
    router.post('/admin/delAnimations/:_id',User.adminRequired,Animation.del);
    router.post('/admin/addAnimation', User.adminRequired,Animation.save);
    router.post('/admin/upload/:_id', User.adminRequired,koabody({multipart:true}),Animation.savePoster);
    router.post('/admin/catchPicInNet/:_id',User.adminRequired,Animation.catchPicInNet);
    //user
    router.get('/admin/userList', User.adminRequired,User.list);
    router.post('/admin/backUserlist', User.adminRequired,User.backlist);
    router.post('/admin/delUsers',User.adminRequired,User.del);
    //用户登录方面
    router.get('/user/login',User.showSignin);
    router.post('/user/signin', User.signin);
    router.post('/user/logout',User.adminRequired, User.logout);

    // router.get('/wechat/movie',Game.guess);
       

    //comment
    router.post('/user/comment', User.signinRequired,Comment.save);
    router.post('/user/searchComment',Comment.searchCommentByStart);
}


