$(function(){
	//初始化加载
	$.get("server-page/animationAdd.html",function(data){ //初始將a.html include div#iframe
　　$(".movable-con").html(data);
　},'html');
	
　
	$('.nav a').click(function() {
	  　　// 找出 li 中的超链接 href(#id)
　　　　var $this = $(this),
						_clickTab = $this.attr('target'); // 找到链接a中的targer的值
　　　　$.get(_clickTab,function(data){
　　　　　　$(".movable-con").html(data); 
　　　　},'html');
　　}); 
});