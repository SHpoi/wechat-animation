$(function(){
	//搜索框
	var $searchBar = $('#searchBar'),
		$searchResult = $('#searchResult'),
		$searchText = $('#searchText'),
		$searchInput = $('#searchInput'),
		$searchClear = $('#searchClear'),
		$searchCancel = $('#searchCancel');

	function hideSearchResult() {
		$searchResult.hide();
		$searchInput.val('');
	}

	function cancelSearch() {
		hideSearchResult();
		$searchBar.removeClass('weui-search-bar_focusing');
		$searchText.show();
	}
	$searchText.on('click', function() {
		$searchBar.addClass('weui-search-bar_focusing');
		$searchInput.focus();
	});
	$searchInput.on('blur', function() {
		if (!this.value.length) cancelSearch();
	}).on('input', function() {
		if (this.value.length) {
			if($(this).val()){
				$.post('/search/word?search='+$(this).val(),function(data){
					if(data.word && data.word.length>0){
						$('#searchResult').empty().append(createListr(data.word));
						$searchResult.show();
					}
				})
			}
		} else {
			$searchResult.hide();
		}
	});
	$searchClear.on('click', function() {
		hideSearchResult();
		$searchInput.focus();
	});
	$searchCancel.on('click', function() {
		cancelSearch();
		$searchInput.blur();
	});


	//以下为逻辑js
	//跳到搜索页
	$('#searchResult').on('click','.weui-cell_access',function(){
		turnToSearch($(this).find('p').html())
	})
	// $searchInput.on('keyup',function(event){
	// 	event.stopPropagation();
	// 	if(event.keyCode === 13&& $searchInput.val()){
	// 		turnToSearch($searchInput.val())
	// 	}
	// })
	$('form').keypress(function(event){
		if(event.keyCode === 13&& $searchInput.val()){
			turnToSearch($searchInput.val())
		}
		return false;
	})
	//参数为文字
	function turnToSearch(q){
		$searchResult.hide();
		$.post('/search/animation?search='+q,function(data){
			if(data.animations && data.animations.length>0){
				$('.search-item').remove();
				var str='';
				for(var i in data.animations){
					str+=createItem(data.animations[i])
				}
				$('body').append(str);

			}
		})

	}
	function createItem(item){
		var ge='';
		for(var j in item.genres){
			ge+='<i class="tag">'+item.genres[j]+'</i>'
		}
		var str='<div class="search-item clearfix">'+
							'<div class="top-bg blur">'+
								'<div class="colorfilter"></div><img src="/upload/'+item.poster+'" alt=""/>'+
							'</div>'+
							'<img src="/upload/'+item.poster+'" alt=""/>'+
							'<div class="right-search-detail">'+
								'<p class="search-title textOverhidden">'+item.title +'</p>'+
								'<p class="search-director"> <img src="data:image/png;base64,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" alt="" class="base64-user" />'+
									item.director +
								'</p>'+
								'<p class="search-category"><img src="data:image/png;base64,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" alt="" class="base64-tag" />'+
									ge +
								'</p>'+
							'</div>'+
						'</div>';
		return str;
	}
	function createListr(arr){
		var str='';
		for(var i in arr){
			str+=
			'<div class="weui-cell weui-cell_access"><div class="weui-cell__bd weui-cell_primary"><p class="animation-search-Retext">'+
			 arr[i] +'</p></div></div>'
		}
		return str;
	}
})