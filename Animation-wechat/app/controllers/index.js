var Animation = require('../api/animation.js');


exports.index = function*(next) {
    var animation_hot = yield Animation.findHostAnimation(1, 6);
    var animations_cold= yield Animation.findHostAnimation(-1, 6);
    var animations_ran = yield Animation.randomSix();
    var animations_suggest=yield Animation.getSuggest();
    yield this.render('wechat/index', {
        animation: [
                    {"title":"站长推荐","slider":animations_suggest},
                    {"title":"热门动漫","slider":animation_hot},
                    {"title":"猜你喜欢","slider":animations_ran},
                    {"title":"绝对冷番","slider":animations_cold},
                   ]
    });
}
exports.list = function*(next) {
    var g=this.query.genres;
    var q=this.query.search;
    var animations;
    if(q){
      animations= yield Animation.searchByName(q);
    }
    if(g){
      animations = yield Animation.searchGenres(g);
    }
    yield this.render('wechat/search', {animations:animations});
   
}
exports.searchList = function*(next) {
    var q=this.query.search;
    var animations = yield Animation.searchByName(q);
    this.body={animations:animations};
}
//返回搜索页 动画项的标签列表
exports.backword=function *(next){
   var q=this.query.search;
   var arr=[];
   if(q){
    var animations=yield Animation.searchByName(q)
   }
   if(animations && animations.length>0){
    for(var i=0;i<animations.length;i++){
        arr.push(animations[i].title)
    }
    this.body={word:arr};
   }
   yield next;
  
}
