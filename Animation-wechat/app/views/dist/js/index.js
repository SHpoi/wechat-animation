$(function() {
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
	var swiper = new Swiper('.animation-slider', {
		pagination: '.swiper-pagination',
		paginationClickable: true,
		spaceBetween: 0,
		loop: true,
		centeredSlides: true,
		autoplay: 2500,
		autoplayDisableOnInteraction: false,
		lazyLoading: true,
		preloadImages: false
	});

	//以下为逻辑js
	//跳到搜索页
	$('#searchResult').on('click','.weui-cell_access',function(){
		turnToSearch($(this).find('p').html())
	})
	$searchInput.on('keyup',function(event){
		if(event.keyCode === 13){
			turnToSearch($searchInput.val())
		}
	})
	$('.tag-grid').click(function(){
		turnToSearch('',$(this).children('.weui-grid__label').html())
	})
	//参数为文字
	function turnToSearch(q,g){
		$searchResult.hide();
		window.location.href='/search/list?search='+q+'&genres='+g;
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

	//跳转到动漫页
	$('body').on('click','.swiper-slide',function(){
		var _id=$(this).attr('animateId');
		window.location.href='http://sunqixiong123.ngrok.cc/wechat/jump/'+_id
	})

})