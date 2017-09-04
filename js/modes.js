/*

所有功能模块的插件

*/

/*

登陆模块

*/
var fn = function() { };



/*
<div id='sl_mlogin_2' class='fr_mlogin ui_mlogin ui_mlogin_box'>
<div id='sl_mlogin_2_title' class='fr_mlogin_title ui_mlogin_title'></div>
<div id='sl_mlogin_2_body' class='fr_mlogin_body ui_mlogin_body '>
<div id='member_login' class='data data_login data_login_bg_v1'>
<div><div class='tab1 tab_active'>会员登录</div><div class='tab2'><a href='#'>管理登录</a></div><div class='clear'></div></div>
<p>用户名<input type='text' class='input_box_v1'/></p>
<p>密&nbsp;&nbsp;&nbsp;&nbsp;码<input type='text' class='input_box_v1' /></p>
<p class='login_reg_button'><a href='#'>登录</a><a href='#'>注册</a></p>
<p class='bottomline'>忘记密码?</p>
</div>
<!--  
<div id='admin_login' class='data data_login data_login_bg_v2'>
<div><div class='tab1 '><a href='#'>会员登录</a></div><div class='tab2 tab_active'>管理登录</div><div class='clear'></div></div>
<p>用户名<input type='text' class='input_box_v1'/></p>
<p>密&nbsp;&nbsp;&nbsp;&nbsp;码<input type='text' class='input_box_v1' /></p>
<p class='login_reg_button ml75'><a href='#'>登录</a></p>
</div>
-->  
</div>
<div id='sl_mlogin_2_foot' class='fr_mlogin_foot ui_mlogin_foot'></div>    
</div>

*/




/*
var LoginMode = fn.prototype = {

tab_count: 1, //不同登录类型的切换标签
tab_text: ["用户登录"], //tab的文本内容
status_count: 1, //表示有几种状态
event_name: "click", //切换的事件
id_per_fix: "",
id_no: 0,
title: {//title 对象

id: LoginMode.id_perfix + LoginMode.id_no.toString() + "title",
fnCreate: function()
{
return this.id;
var vInnerHtml = "";
if (LoginMode.tab_count > 1)
{
if (LoginMode.tab_count != LoginMode.tab_text.length)
{
//alert("输入参数错误!");
return "输入参数错误!";
}
for (var i = 0; i < LoginMode.tab_count; i++)
{
vInnerHtml += "<a href='javascript:'>" + LoginMode.tab_text[i] + "</a>";
}
}
else
{
vInnerHtml += LoginMode.tab_text[0] ? LoginMode.tab_text[0] : LoginMode.tab_text;
}

return "<div id='" + this.id + "'>" + vInnerHtml + "</div>";
}

},
body: {//body对象

id: LoginMode.id_perfix + LoginMode.id_no.toString() + "body",
fnCreate: function()
{

var vInnerHtml = "";
vInnerHtml += "<div id='member_login' class='data data_login data_login_bg_v1'><p>用户名<input type='text' class='input_box_v1'/></p><p>密&nbsp;&nbsp;&nbsp;&nbsp;码<input type='text' class='input_box_v1' /></p><p class='login_reg_button'><a href='#'>登录</a><a href='#'>注册</a></p><p class='bottomline'>忘记密码?</p></div>";
vInnerHtml += "<div id='admin_login' class='data data_login data_login_bg_v2'><p>用户名<input type='text' class='input_box_v1'/></p><p>密&nbsp;&nbsp;&nbsp;&nbsp;码<input type='text' class='input_box_v1' /></p><p class='login_reg_button ml75'><a href='#'>登录</a></p></div>";
return "<div id='" + LoginMode.id_perfix + LoginMode.id_no.toString() + "'>" + vInnerHtml + "</div>";
}

},
foot: {//foot对象

id: LoginMode.id_perfix + LoginMode.id_no.toString() + "foot",
fnCreate: function()
{

var vInnerHtml = "";
return "<div id='" + LoginMode.id_perfix + LoginMode.id_no.toString() + "'>" + vInnerHtml + "</div>";
}
},
mode: {

fnCreate: function()
{

return "<div id='" + LoginMode.id_perfix + LoginMode.id_no.toString() + "'>" + LoginMode.title.fnCreate() + LoginMode.body.fnCreate() + LoginMode.foot.fnReady() + "</div>";

},
fnMotion: function()
{
var $obj = $(this.fnCreate()),
tabs = $obj.children("#" + LoginMode.title.id).children("a"),
tab_content = $obj.children("#" + LoginMode.body.id).children("div");

tabs.bind(LoginMode.event_name, function()
{

tab_content.hide().eq(tabs.index(this)).show();
});
}

}


}
*/

/*

翻页模块

*/

/*

下拉菜单

*/

/*

图片播放器

*/

/*
<div class='playerbox type_smallimg' style='border: solid 2px red;'>
<div class='bigimgarea'>
<img src='/img/images/image3.jpg' alt='uuuu' />
</div>
<div class='introducearea'>
<div>
<h2>
this is the third image's title</h2>
<div>
absfas idfasjd fasldfias dfmas dfjasldf asjdf asdfsad
</div>
</div>
</div>
<div class='indexarea'>
<div class='type_title'>
<a href='javascript:'>adfasd</a><a href='javascript:' class='now'>asdfasd </a><a href='javascript:'>jjkj</a><a href='javascript:'>pwoqrui </a>
</div>
<div class='type_pager'>
<a href='javascript:'>4</a><a href='javascript:' class='now'>3 </a><a href='javascript:'>2</a><a href='javascript:'>1 </a>
</div>
<div class='type_smallimg'>
<a href='javascript:'><img src='/img/images/image3.jpg' alt='sfd' /></a><a href='javascript:' class='now'> </a><a href='javascript:'></a><a href='javascript:'> </a>
</div>
</div>
</div>
            

var ImgPlayer = fn.prototype = {

arr_href: [], //图片播放器，图片地址的数组
arr_title: [], //标题的
arr_introduce: [], //介绍
delay: 1000, //滚动的时间差
current_index: 0, //当前显示的图片的索引
player: $("<div class='playerbox type_smallimg'><div class='bigimgarea'></div><div class='introducearea'></div><div class='indexarea'><div class='type_title'></div><div class='type_pager'></div><div class='type_smallimg'></div></div></div>"),
bigimgarea: null, // ImgPlayer.player.children(".bigimgarea"),
introducearea: null, // ImgPlayer.player.children(".introducearea"),
indexarea: null, //ImgPlayer.player.children(".indexarea"),
indexs: null, // ImgPlayer.indexarea.children("div").children("a"),
setcurrent: function(index)
{
ImgPlayer.bigimgarea.children("img").hide().eq(index).show();
ImgPlayer.introducearea.children("div").hide().eq(index).show();
ImgPlayer.indexarea.children("div").each(function()
{
$(this).children("a").removeClass("now").eq(index).addClass("now");
});
},
regevent: function()
{
ImgPlayer.indexs.live("click", function()
{
ImgPlayer.setcurrent(ImgPlayer.indexs.index(this));
});
},
run: function()
{
///<summary>
/// 开始滚动
///</summary>
var t = setTimeout(ImgPlayer.run, ImgPlayer.delay);
ImgPlayer.current_index++;
if (ImgPlayer.current_index == ImgPlayer.arr_href.length)
ImgPlayer.current_index = 0;
ImgPlayer.setcurrent(ImgPlayer.current_index);
},
addImg: function(href, title, introduce)
{

ImgPlayer.arr_href.push(href);
ImgPlayer.arr_introduce.push(introduce);
ImgPlayer.arr_title.push(title);

ImgPlayer.indexarea.children(".type_title").append("<a href='javascript:'>" + title + "</a>");
ImgPlayer.indexarea.children(".type_smallimg").append("<a href='javascript:'><img alt='" + title + "' src='" + href + "' /></a>");
ImgPlayer.indexarea.children(".type_pager").prepend("<a href='javascript:'>" + this.arr_href.length++ + "</a>");
ImgPlayer.bigimgarea.append("<img alt='" + title + "' src='" + href + "'/>");
ImgPlayer.introducearea.append("<div><h3>" + title + "</h3><div>" + introduce + "</div></div>");

ImgPlayer.player = ImgPlayer.player.append(ImgPlayer.indexarea).append(ImgPlayer.bigimgarea).append(ImgPlayer.introducearea);

}

}
*/
(function($)
{
    $.fn.ImgPlayer = function(options)
    {

        var defaultopts = {
            type: "pager", //播放器类型
            arr_href: [], //图片播放器，图片地址的数组
            arr_title: [], //标题的
            arr_introduce: [], //介绍
            delay: 1000 //滚动的时间差

        },
    current_index = 0, //当前显示的图片的索引
    player = $("<div class='playerbox'><div class='bigimgarea'></div><div class='introducearea'></div><div class='indexarea'><div class='type_title'></div><div class='type_pager'></div><div class='type_smallimg'></div></div></div>"),
    bigimgarea = player.children(".bigimgarea"),
    introducearea = player.children(".introducearea"),
    indexarea = player.children(".indexarea"),
    setcurrent = function(index)
    {
        bigimgarea.children("img").hide().eq(index).show();
        introducearea.children("div").hide().eq(index).show();
        indexarea.children("div").each(function()
        {
            var oTemp = $(this).children("a").removeClass("now")
            if ($(this).attr("class") == "type_pager")
            {
                oTemp.eq(oTemp.length - index - 1).addClass("now");
            }
            else
            {
                oTemp.eq(index).addClass("now");
            }
        });
    },
    regevent = function()
    {
        indexarea.children("div").each(function()
        {
            var indexs = $(this).children("a"), index;
            if ($(this).attr("class") == "type_pager")
            {
                indexs.click(function()
                {
                    index = indexs.length - indexs.index(this) - 1
                    current_index = index;
                    setcurrent(index);
                    $(this).blur();
                });
            }
            else
            {
                indexs.click(function()
                {
                    index = indexs.index(this);
                    current_index = index;
                    setcurrent(index);
                    $(this).blur();
                });

            }

        });
    },
    run = function()
    {
        ///<summary>
        /// 开始滚动
        ///</summary>
        var t = setTimeout(run, defaultopts.delay);
        if (current_index == defaultopts.arr_href.length)
            current_index = 0;
        setcurrent(current_index);
        current_index++;
    },
    addImg = function(href, title, introduce, index)
    {
        if (index == undefined)
            index = defaultopts.arr_href.length;
        defaultopts.arr_href[index] = href;
        defaultopts.arr_introduce[index] = introduce;
        defaultopts.arr_title[index] = title;

        indexarea.children(".type_title").append("<a href='javascript:'>" + title + "</a>");
        indexarea.children(".type_smallimg").append("<a href='javascript:'><img alt='" + title + "' src='" + href + "' /></a>");

        indexarea.children(".type_pager").prepend("<a href='javascript:'>" + (index + 1).toString() + "</a>");
        bigimgarea.append("<img alt='" + title + "' src='" + href + "'/>");
        introducearea.append("<div><h3>" + title + "</h3><div>" + introduce + "</div></div>");

        player = player.append(indexarea).append(bigimgarea).append(introducearea);

    };
        if ($(this).children(".playerbox").length > 0)
        {
            $(this).children(".playerbox").remove();
        }
        defaultopts = $.extend(defaultopts, options);

        if (defaultopts.arr_href.length == defaultopts.arr_introduce.length && defaultopts.arr_href.length == defaultopts.arr_title.length)
        {
            $.each(defaultopts.arr_href, function(i, n)
            {
                addImg(n, defaultopts.arr_title[i], defaultopts.arr_introduce[i], i);
            });
        }

        $(this).append(player.addClass("type_" + defaultopts.type));

        regevent();
        run();
    };

})(jQuery)


