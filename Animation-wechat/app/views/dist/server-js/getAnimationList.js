$(function() {
  var formatDate = function(date, format) {
    if (!date) return;
    if (!format) format = "yyyy-MM-dd";
    switch (typeof date) {
      case "string":
        date = new Date(date.replace(/-/, "/"));
        break;
      case "number":
        date = new Date(date);
        break;
    }
    if (!date instanceof Date) return;
    var dict = {
      "yyyy": date.getFullYear(),
      "M": date.getMonth() + 1,
      "d": date.getDate(),
      "H": date.getHours(),
      "m": date.getMinutes(),
      "s": date.getSeconds(),
      "MM": ("" + (date.getMonth() + 101)).substr(1),
      "dd": ("" + (date.getDate() + 100)).substr(1),
      "HH": ("" + (date.getHours() + 100)).substr(1),
      "mm": ("" + (date.getMinutes() + 100)).substr(1),
      "ss": ("" + (date.getSeconds() + 100)).substr(1)
    };
    return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {
      return dict[arguments[0]];
    });
  };

  $.post('/admin/backAnimations',showAnimations);

  $('.animation-list-search').on('click', '.iconfont', function() {
    var search = $(this).prev().val();
    $.post('/admin/backAnimations?search='+search,showAnimations);
  })
   var _id;
  $('#y1table1').on('click','.js-delbtn',function(){
    _id=$(this).attr('data-id');
    myalert.show('是否删除  '+$(this).closest('tr').find('.ykytd-title').html());
  })
  myalert.setConfigAgain(function(){
    $.post('/admin/delAnimations/'+_id,function(data){
      if(data.success==1){
        alert('删除成功');
      }else{
        alert('删除失败');
      }
      $.post('/admin/backAnimations?search='+$('.animation-list-search input').val(),showAnimations);
    });
  })

  $('#y1table1').on('click','.js-modbtn',function(){
    var _id=$(this).attr('data-id');
    $('.movable-con').load('/admin/inputNewAnimation?_id='+_id);
  })


  function showAnimations(data) {
    var arr = []
    var animations = data.animations;
    for (var i in animations) {
      arr.push({
        title: animations[i].title,
        director: animations[i].director,
        pre: '<button type="button" class="btn btn-success js-prebtn" data-id="' + animations[i]._id + '">预览</button>',
        mod: '<button type="button" class="btn btn-primary js-modbtn" data-id="' + animations[i]._id + '">修改</button>',
        del: '<button type="button" class="btn btn-danger js-delbtn"  data-id="' + animations[i]._id + '">删除</button>',
        addTime: formatDate(new Date(animations[i].meta.createAt))
      })
    }
    var cs = new table({
      "tableId": "y1table1", //必须
      "headers": ["动漫名字", "导演", "预览", "修改", "删除", "录入时间"], //必须
      "data": arr, //必须
      "displayNum": 8, //必须  默认 10，每页多少数
      "groupDataNum": 10 //可选  默认 10,最大页数
    });
  }

  
})