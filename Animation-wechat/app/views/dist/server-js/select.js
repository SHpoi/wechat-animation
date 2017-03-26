//闭包，只放出xx函数来创建select 单选下拉框
(function(window, undefined) {
	function DiySelect(json) {
		if (this instanceof DiySelect) {
			if ($.isPlainObject(json)) {
				//配置
				this.config = {
					selector: null,
					series: [],
					isReplaceText: true,
					isHideSlide: true,
					callback: null,
					createLi: function(liitem) {
						var li = '<li class="item">' + liitem.text + '</li>';
						return li;
					},
				};
				$.extend(this.config, json);
			}	
			this.config.selector=$(this.config.selector);
			this.init(json);
			return this;
		} else {
			return new DiySelect(json);
		}
	}
	//html模板 建议用DiySelect改样式
	DiySelect.prototype.tmp = '<div class="dropdwon dropdwon-radio">' +
		'<div class="dropdwon-header">' +
		'<p class="dropdwon-text">我是下拉框</p>' +
		'<i class="iconfont icon-tabxiala"></i>' +
		'</div>' +
		'<div class="dorpdwon-con">' +
		'<ul class="dropdwon-select">' +
		'</ul>' +
		'</div>' +
		'</div>';
	DiySelect.prototype.init = function(json) {

		var self=this;
		this.config.selector.each(function(){
			//创建html模板
			var select = $(self.tmp);
			//插入插件
			$(this).append(select);

			//设置option
			self.setOption(self.config.series);

			self.setDomEvent(select);
		})

		

		return this;
	};
	DiySelect.prototype.setDomEvent = function(select) {

		this.normalSlide(select);
		this.replaceText(select);
	};
	DiySelect.prototype.replaceText = function(select) {
		var self = this;
		select.on('click', '.item', function(event) {
			//单选
			if (self.config.isReplaceText) {
				var text = $(this).text();
				var fir = select.find('.dropdwon-text');
				fir.html(text);
			}
			//如果存在回调函数  调用   ,并把jquery li对象传过去
			if (self.config.callback) {
				self.config.callback.call($(this), $(this));
			}
		});
	}
	DiySelect.prototype.normalSlide = function(select) {
			var self = this,
				diyContent = select.children('.dorpdwon-con');
			//阻止事件冒泡到document
			this.config.selector.click(function(event) {
				event.stopPropagation();
			});
			//划上划下
			select.click(function() {
				if (self.config.isHideSlide) {
					diyContent.toggle();
				} else {
					diyContent.show();
				}
			});
			//点击其他地方，列表关闭
			$(document).click(function() {
				diyContent.hide();
			});
		}
		//配置option
	DiySelect.prototype.setOption = function(datalist) {
		var lilist = this.setLilist(datalist);
		//设置lilist 再设置firstText的文本
		this.config.selector.find('ul').html(lilist).end().find('.dropdwon-text').html(datalist[0].text);
	};
	DiySelect.prototype.setLilist = function(datalist) {
		var lilist = '',
			self = this;
		datalist.forEach(function(item, i) {
			var li = self.config.createLi(item);
			lilist += li;
		});
		return lilist;
	};
	window.DiySelect = DiySelect;
})(window);

/**多选下拉框**/
(function(window, $, undefined) {
	function MultiDiySelect(json) {
		var self=this;
		if (this instanceof MultiDiySelect) {
			if ($.isPlainObject(json)) {
				//配置
				this.config = {
					addMultiShowText:function(liItem,colorIndex){
						var colen=self.config.MultiShowTextColor.length;
						if(colorIndex>=colen){
							colorIndex=colorIndex % colen;
						}
						return '<span class="showItem" style="background:'+self.config.MultiShowTextColor[colorIndex]+'">'+liItem.text+'<i class="icon iconfont icon-cuowu"></i></span>'
					},
					MultiShowTextColor:['#2196F3','#8bc34a','#d9e2e6','#2a6d31','#ffeb3b','#673ab7'],
					selector: null,
					series: [],
					isReplaceText: true,
					isHideSlide: true,
					callback: null,
					createLi: function(liitem) {
						var li = '<li class="item">' + liitem.text + '</li>';
						return li;
					},
				};
				$.extend(this.config, json);
			}
			this.init(json);
			return this;
		} else {
			return new MultiDiySelect(json);
		}
	}
	var newpro = $.extend(true, {}, DiySelect.prototype);
	MultiDiySelect.prototype = newpro;
	newpro.constructor = MultiDiySelect;
	//私有的特殊方法
	MultiDiySelect.prototype.replaceText = function(select) {
		var self = this;
		select.on('click', '.item', function(event) {
			//单选
			if (self.config.isReplaceText) {
				var text = $(this).text();
				var fir = select.find('.dropdwon-text');
				var onedata=self.config.series[$(this).index()];
				if(self.filterChoice(onedata)){
					fir.append(self.config.addMultiShowText(onedata,$(this).index()));
				}
				
			}
			//如果存在回调函数  调用   ,并把jquery li对象传过去
			if (self.config.callback) {
				self.config.callback.call($(this), $(this));
			}
		});
		select.on('click','.dropdwon-text > .showItem .icon-cuowu',function(event){
			var event=event|| window.event;
			event.stopPropagation();
			$(this).closest('.showItem').remove();
		})
	}
	MultiDiySelect.prototype.filterChoice=function(onedata){
		var canAdd=true;
		$(this.config.selector.find('.dropdwon-text > .showItem')).each(function(){
			if($(this).text()===onedata.text){
				canAdd=false;
			}
		})
		return canAdd;
	}
	//html模板 建议用MultiDiySelect改样式
	MultiDiySelect.prototype.tmp = '<div class="dropdwon dropdwon-checkbox">' +
		'<div class="dropdwon-header">' +
		'<p class="dropdwon-text">我是下拉框</p>' +
		'<i class="iconfont icon-tabxiala"></i>' +
		'</div>' +
		'<div class="dorpdwon-con">' +
		'<ul class="dropdwon-select">' +
		'</ul>' +
		'</div>' +
		'</div>';
	MultiDiySelect.prototype.setOption = function(datalist) {
		var lilist = this.setLilist(datalist);
		//设置lilist 再设置firstText的文本
		this.config.selector.find('ul').html(lilist).end().find('.dropdwon-text').html(this.config.addMultiShowText(datalist[0],0));
	};
	window.MultiDiySelect = MultiDiySelect;
})(window, jQuery);


//搜索框
(function(window, $, undefined) {
	function DiySearch(json) {
		this.saveData=[];
		if (this instanceof DiySearch) {
			if ($.isPlainObject(json)) {
				//配置
				this.config = {
					selector: null,
					series: [],
					isReplaceText: true,
					isHideSlide: true,
					callback: null,
					createLi: function(liitem) {
						var li = '<li class="item">' + liitem.text + '</li>';
						return li;
					},
				};
				$.extend(this.config, json);
			}			
			//创建html模板
			var select = $(this.tmp);
			//插入插件
			$(this.config.selector).append(select);
			this.setDomEvent(select);
			return this;
		} else {
			return new DiySearch(json);
		}
	}
	var newpro = $.extend(true, {}, DiySelect.prototype);
	DiySearch.prototype = newpro;
	newpro.constructor = DiySearch;
	//私有的特殊方法
	DiySearch.prototype.dataFilter=function(value){
		var self=this;
		var newarr=this.saveData.filter(function(item){
			if(item.text.indexOf(value)!==-1){
				return true;
			}
		});
		self.saveData=newarr;
		return newarr;
	}
	
	//html模板 建议用DiySearch改样式
	DiySearch.prototype.tmp = '<div class="form-search">' +
		'<input type="text" class="form-input" placeholder="我是搜索框">' +
		'<i class="iconfont icon-sousuo1"></i>' +
		'<div class="dorpdwon-con">' +
		'<ul class="dropdwon-select">' +
		'</ul>' +
		'</div>' +
		'</div>';
	
	DiySearch.prototype.setDomEvent = function(select) {
		var self = this,
			input = select.find('.form-input');
		//表单事件
		input.on('click keyup', function(event) {

			var inp = $(this).val();
			if (inp) {
				//判断是回车键位
				if (event.keyCode === 13) {
					self.config.callback($(this).val());
				} else {
					var value=input.val();
						var newarr=self.dataFilter(value);
					if(self.saveData&&newarr.length>0 && value && event.keyCode !==8){
						select.find('ul').html(self.setLilist(newarr)).parent().show();
					}else{
						$.get(self.config.getLiSeriesUrl, inp, function(data) {			
							select.find('ul').html(self.setLilist(data)).parent().show();
							self.saveData=data;
						},'json');
					}
				}
			}
		});
		//li点击事件 
		select.on('click', '.item', function(event) {
			var text = $(this).text();
			var fir = select.find('.form-input');
			fir.val(text);
			//回调函数  调用 ,与下拉框不同 ，搜索只把默认的text的值加上
			self.config.callback(text);
			select.find('.dorpdwon-con').hide();
			return false;
		});
		//btn点击事件
		select.on('click', '.icon-sousuo1', function() {
			self.config.callback(input.val());
		});
		this.config.selector.click(function(event) {
			event.stopPropagation();
		});
		$(document).click(function() {
			select.find('.dorpdwon-con').hide();
		});
	};
	window.DiySearch = DiySearch;
})(window, jQuery);

//多选搜索框加下拉框
(function(window, undefined) {
	function DiySelectAndSearch(json) {
		var self=this;
		if (this instanceof DiySelectAndSearch) {
			if ($.isPlainObject(json)) {
				//配置
				this.config = {
					addMultiShowText:function(liItem,colorIndex){
						var colen=self.config.MultiShowTextColor.length;
						if(colorIndex>=colen){
							colorIndex=colorIndex % colen;
						}
						return '<span class="showItem" style="background:'+self.config.MultiShowTextColor[colorIndex]+'">'+liItem.text+'<i class="icon iconfont icon-cuowu"></i></span>'
					},
					MultiShowTextColor:['#2196F3','#8bc34a','#d9e2e6','#2a6d31','#ffeb3b','#673ab7'],
					selector: null,
					series: [],
					tip:'我是多选下拉框+搜索',
					getLiSeriesUrl:'json/data.json',
					isReplaceText: true,
					isHideSlide: true,//注意此项不可改
					callback: null,
					createLi: function(liitem) {
						var li = '<li class="item">' + liitem.text + '</li>';
						return li;
					},
				};
				$.extend(this.config, json);
			}
			this.init(json);
			return this;
		} else {
			return new DiySelectAndSearch(json);
		}
	}
	//html模板 建议用DiySelectAndSearch改样式
	DiySelectAndSearch.prototype.tmp ='<div class="dropdwon dropdwon-checkbox dropdwon-search">'+
						'<div class="dropdwon-header">'+
							'<p class="dropdwon-text">我是多选下拉框+搜索</p>'+
							'<i class="iconfont icon-tabxiala"></i>'+
						'</div>'+
						'<div class="dorpdwon-con">'+
							'<div class="form-search">'+
								'<input type="text" class="form-input" placeholder="我是搜索框">'+
								'<i class="iconfont icon-sousuo1"></i>'+
							'</div>'+
							'<ul class="dropdwon-select"></ul>'+
						'</div>'+
					'</div>';
	DiySelectAndSearch.prototype.init = function(json) {

			//创建html模板
			var select = $(this.tmp);
			//插入插件
			$(this.config.selector).append(select);

			// //设置option
			this.setOption(this.config.series,select);

			this.setDomEvent(select);

		return this;
	};
	DiySelectAndSearch.prototype.setDomEvent = function(select) {

		this.normalSlide(select);
		this.replaceText(select);
	};
	DiySelectAndSearch.prototype.replaceText = function(select) {
		var self = this;
		var fir = select.find('.dropdwon-text');
		select.on('click','.dorpdwon-con',function(event){
			var event=event||window.event;
			event.stopPropagation();
		})
		select.on('click', '.item', function(event) {
			//单选
			if (self.config.isReplaceText) {
				var text = $(this).text();

				if(fir.find('.showItem').length===0){//如果数量为0 清空提示
					fir.html('')
				}

				var onedata=self.config.series[$(this).index()];
				if(self.filterChoice(onedata)){
					fir.append(self.config.addMultiShowText(onedata,$(this).index()));
				}			
			}
			//如果存在回调函数  调用   ,并把jquery li对象传过去
			if (self.config.callback) {
				self.config.callback.call($(this), $(this));
			}
		});
		select.on('click','.dropdwon-text > .showItem .icon-cuowu',function(event){
			var event=event|| window.event;
			event.stopPropagation();
			$(this).closest('.showItem').remove();
			if(fir.find('.showItem').length===0){//如果数量为0 清空提示
				fir.html(self.config.tip);
			}
		})
	}
	DiySelectAndSearch.prototype.filterChoice=function(onedata){
		var canAdd=true;
		$(this.config.selector.find('.dropdwon-text > .showItem')).each(function(){
			if($(this).text()===onedata.text){
				canAdd=false;
			}
		})
		return canAdd;
	}
	DiySelectAndSearch.prototype.dataFilter=function(value){
		var self=this;
		var newarr=this.config.series.filter(function(item){
			if(item.text.indexOf(value)!==-1){
				return true;
			}
		});
		self.config.series=newarr;
		return newarr;
	}
	
	DiySelectAndSearch.prototype.normalSlide = function(select) {
			var self = this,
				diyContent = select.children('.dorpdwon-con');
			//阻止事件冒泡到document
			this.config.selector.click(function(event) {
				event.stopPropagation();
			});
			//划上划下
			select.click(function() {
				if (self.config.isHideSlide) {
					diyContent.toggle();
				} else {
					diyContent.show();
				}
			});

			var input = select.find('.form-input');
			//表单事件
			input.on('click keyup', function(event) {
				var inp = $(this).val();
				if (inp) {
					//判断是回车键位
					if (event.keyCode === 13) {
						self.config.callback($(this).val());
					} else {
						var value=input.val();
							var newarr=self.dataFilter(value);
						if(self.config.series&&newarr.length>0 && value && event.keyCode !==8){
							select.find('ul').html(self.setLilist(newarr)).parent().show();
						}else{
							$.get(self.config.getLiSeriesUrl, inp, function(data) {			
								select.find('ul').html(self.setLilist(data)).parent().show();
								self.config.series=data;
							},'json');
						}
					}
				}
			});

			//点击其他地方，列表关闭
			$(document).click(function() {
				diyContent.hide();
			});
		}
		//配置option
	DiySelectAndSearch.prototype.setLilist = function(datalist) {
		var lilist = '',
			self = this;
		datalist.forEach(function(item, i) {
			var li = self.config.createLi(item);
			lilist += li;
		});
		return lilist;
	};
	DiySelectAndSearch.prototype.setOption = function(datalist,select) {
		select.find('.dropdwon-text').html(this.config.tip);
	};
	window.DiySelectAndSearch = DiySelectAndSearch;
})(window);

