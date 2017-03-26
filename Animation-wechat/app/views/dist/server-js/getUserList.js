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

  $.post('/admin/backUserlist',showUsers);

  $('#userSearch').on('click', '.iconfont', function() {
    var search = $(this).prev().val();
    $.post('/admin/backUserlist?search='+search,showUsers);
  })

  $('#y1table2').on('click','.js-delbtn',function(){
    var _id=$(this).attr('data-id');
    $.post('/admin/delUsers?_id='+_id,function(data){
      if(data.success==1){
        alert('删除成功');
      }else{
        alert('删除失败');
      }
      $.post('/admin/backUserlist?search='+$('#userSearch').val(),showUsers);
    });
  })



  function showUsers(data) {
    var arr = []
    var users = data.users;
    for (var i in users) {
      arr.push({
        openId: users[i].openid,
        name:users[i].name,
        del: '<button type="button" class="btn btn-danger js-delbtn"  data-id="' + users[i]._id + '">删除</button>',
        addTime: formatDate(new Date(users[i].meta.createAt))
      })
    }
    var cs = new table({
      "tableId": "y1table2", //必须
      "headers": ["用户openId", "昵称","删除","录入时间"], //必须
      "data": arr, //必须
      "displayNum": 8, //必须  默认 10，每页多少数
      "groupDataNum": 10 //可选  默认 10,最大页数
    });
  }

  
})