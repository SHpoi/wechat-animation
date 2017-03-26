$(function(){
	var ale=(function(){
		var instance=null;
		var isClose=true;
		var body=$('body')
		function init(callback){
			function randomColor() {
				var colors = ['#72e9f9', '#2196f3', '#ff5722', '#ff9800', '#cddc39', '#009688', '#8ad0c9', '#f8ac59'];
				return colors[Math.ceil(Math.random() * 7)];
			}
			function show(text,close){
				 	$('.alert-del').show();
				 	$('.mask').show();
				 	text && $('.alert-del').find('.text50').text(text);
			}
			function hide(){		
				 	$('.alert-small').hide();
 			    $('.mask').hide();
			}
			function input(){
					$('.alert-input').show().find('input').val('')
				 	$('.mask').show();
			}
			body.find('.alert-input').find('.btn-success').bind('click',function(){
				$('.icon-roundadd').before('<button class="btn btn-small " type="button" style="background:' + randomColor() + '"> ' + $('#insertTag').val() + '</button>');
			}).bind('click',hide);
			body.find('.alert-del').find('.btn-success').bind('click',callback).bind('click',hide);
			body.find('.alert-small').find('.btn-danger').bind('click',hide);	
			
			return {
				show:show,
				input:input,
				setConfigAgain:function(callbackAgain,text){
					body.find('.alert-del').find('.btn-success').unbind('click').bind('click',hide).bind('click',callbackAgain);
					$('.alert-small').find('.text50').text(text);
				}
			}
		}	
		return {
			getInstance:function(callback,contentText){
				if(!instance){
					return instance=new init(callback,contentText);
				}
				return instance;
			}
		}
	})();
	window.myalert=ale.getInstance(function(){

	},'hahah');
	/**
	 * 	aa.show();    //显示弹出框
	 	aa.setConfigAgain(function(){  //重置 中心文字 和 回调
	 	alert(2);
	 },'hawoca');   
	 */
	
})