$(function() {
	var colors = ['#72e9f9', '#2196f3', '#ff5722', '#ff9800', '#cddc39', '#009688', '#8ad0c9', '#f8ac59']
	$('.animation-es-add').unbind().click(function() {
		var num = $(this).parent().children('.animation-es-list').length;
		$(this).parent().append('<div class="form-column form-column-2 animation-es-list"><label for="form1" class="animation-es-label">' + ++num + '</label><input class="form-input animation-es-input" id="form1" type="text"></div>');
	})

	
	$('.icon-roundadd').unbind().click(function() {
		myalert.input();

	})
	// $('#addnewTag').unbind().blur(function() {
	// 	$('.icon-roundadd').before('<button class="btn btn-small " type="button" style="background:' + randomColor() + '"> ' + $(this).val() + '</button>');
	// 	$(this).fadeOut();
	// })
	$('.tagdiv').on('dblclick', 'button', function() {
		var self = $(this)
		$(this).fadeOut(1000, function() {
			self.remove();
		})

	})

	$('.douban').unbind().click(function() {
		var self = $(this);
		var title = $('#title').val();
		$.ajax({
			url: 'https://api.douban.com/v2/movie/search?q=' + encodeURIComponent(title),
			cache: true,
			type: 'get',
			dataType: 'jsonp',
			crossDomain: true,
			jsonp: 'callback',
			success: function(data) {
				if (data.subjects.length == 0) {
					alert('没有结果')
				}
				var animate = data.subjects[0];
				var id = data.subjects[0].id;

				$('#title').val(animate.title);
				if(animate.directors && animate.directors.length>0){
					$('#director').val(animate.directors[0].name);
				}else{
					$('#director').val('未知');
				}

				$('#rating').val(animate.rating.average);
				$('#inputPoster').val(animate.images.medium);
				$('#loadpic').attr('src', animate.images.medium);
				$('#year').val(animate.year);
				$('#poster').val(animate.images.medium);


				//二次请求完善信息
				$.ajax({
					url: 'https://api.douban.com/v2/movie/subject/' + id,
					cache: true,
					type: 'get',
					dataType: 'jsonp',
					crossDomain: true,
					jsonp: 'callback',
					success: function(data) {
						var country = data.countries[0] || '国籍未知';
						var language = data.language || '不详';
						var summary = data.summary || '暂无简介';
						$('#summary').val(summary);
						$('#country').val(country);
						$('#language').val(language);

						$('.tagdiv button').remove();

						for (var i = 0; i < animate.genres.length; i++) {
							$('.icon-roundadd').before('<button class="btn btn-small " type="button" style="background:' + colors[i] + '"> ' + animate.genres[i] + '</button>');
						}
					}
				})
			}
		})
	})

	$('.js-add').unbind().click(function() {
		var pic = $('#loadpic').attr('src');
		var opt = {
				title: $('#title').val(),
				genres: getGenres(),
				director: $('#director').val(),
				country: $('#country').val(),
				language: $('#language').val(),
				year: $("#year").val(),
				doubanRating: $('#rating').val(),
				episode: getEpisode(),
				summary: $('#summary').val(),
				poster: pic
			}
		var url,
				ismod;
		var id=$('#animationId').val();
		if(id){
			url='/admin/addAnimation?_id='+$('#animationId').val();
			ismod=1;
		}else{
			url='/admin/addAnimation';
		}
		//先上传普通数据
		$.ajax({
			type: 'POST',
			url: url,
			data: {
				animation: JSON.stringify(opt)
			},
			success: function(data) {
				if(data.success==2){
					alert('存在同名动漫')
					return;
				}
				
				//在此上传图片
				if (new RegExp(/^http/gi).test(pic)) {
					$.post('/admin/catchPicInNet/'+data._id+'?src='+encodeURIComponent(pic),loadpicCallback)
				} else if(new RegExp(/^blob/gi).test(pic)){
					uploadFile(data._id,ismod);
				}
				
			}
		})
	})

	function loadpicCallback(data){
		if (data.code == 200) {
			alert('创建成功');
		}
	}

	function getGenres() {
		var arr = [];
		$('.tagdiv')
		for (var i = 0; i < $('.tagdiv button').length; i++) {
			var htm=$('.tagdiv button').eq(i).html();
			arr.push($.trim(htm));
		}
		return arr;
	}

	function getEpisode() {
		var arr = [];
		for (var i = 0; i < $('.animation-es-input').length; i++) {
			var val = $('.animation-es-input').eq(i).val();
			if (val) {
				arr.push($('.animation-es-input').eq(i).val())
			}
		}
		return arr;
	}


	function uploadFile(id,ismod) {
		var file = document.getElementById("uploadPoster")
		var formData = new FormData();
		formData.append('file', file.files[0]);
		$.ajax({
			url: '/admin/upload/' + id ,
			type: 'POST',
			data: formData,
			cache: false,
			contentType: false,
			processData: false,
			success: loadpicCallback,
			error: function() {
				alert("与服务器通信发生错误");
			}
		});
	}



	//图片上传预览
	$("#uploadPoster").unbind().change(function() {
		var objUrl = getObjectURL(this.files[0]);
		console.log("objUrl = " + objUrl);
		if (objUrl) {
			$("#loadpic").attr("src", objUrl);
		}
	});
	//建立一個可存取到該file的url
	function getObjectURL(file) {
		var url = null;
		if (window.createObjectURL != undefined) { // basic
			url = window.createObjectURL(file);
		} else if (window.URL != undefined) { // mozilla(firefox)
			url = window.URL.createObjectURL(file);
		} else if (window.webkitURL != undefined) { // webkit or chrome
			url = window.webkitURL.createObjectURL(file);
		}
		return url;
	}
})