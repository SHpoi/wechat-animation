$(function(){
	//单纯的左侧栏
	$('.vertical-nav > div').bind('mouseenter',function(){
		$(this).addClass('active').children('.vertical-nav-second').show().end().
						siblings().removeClass('active').
						children('.vertical-nav-second').hide();
	}).bind('mouseleave',function(){
		$(this).removeClass('active').children('.vertical-nav-second').hide();
	})

	//类似树状图的下拉列表  由于时间有限这里只对该下拉列表简单封装 ,以后把树状图再次封装后，再回头干这个
	$('.nav').on('click','a',function(){
		var self=$(this),
				secondNav=self.next();
				self.addClass('active')
				.parent().siblings().children('a').removeClass('active');
		if(secondNav.is(':hidden')){
			secondNav.slideDown();
		}else{
			secondNav.slideUp();
		}
	});
	
})