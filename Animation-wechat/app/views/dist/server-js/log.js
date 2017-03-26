$(function(){
	$('.js-log-pass').on('blur keyup', logPassword);

	function logPassword() {
		var val = $(this).val(),
				warn = $('.user-warning-p'),
				aa = new RegExp("(?![a-z]+$|[0-9]+$)^[a-zA-Z0-9]{7,}$");
		if (aa.test($(this).val())) {
			warn.html('');
			return true;
		} else {
			warn.html("密码必须大于6位有字母和数字组成！");
		}
	}
	$('.js-log-user').on('blur keyup',logUser );

	function logUser() {
		var val = $(this).val(),
				warn = $('.user-warning-u'),
		 		p=vailNickName({val:$(this).val(),minLen:3,maxLen:10});
		if (p.result) {
			warn.html('');
			return true;
		} else {
			warn.html(p.message);
		}
	}


	$('.js-log').click(function(){

		var password=logPassword.call($('.js-log-pass'));

		var user=logUser.call($('.js-log-user'));

		if(password && user ){
			//如果验证全部通过，可以干接下来的事啦
			$.post('/user/signin',{user:{name:$('.js-log-user').val(),password:$('.js-log-pass').val()}},function(data){
				if(data.success==1){
					window.location.href="/admin/index";
				}else{
					alert(data.message)
				}
			})
		}else{
			alert('请输入正确的用户名和密码')
		}
	})


})