$(function()
{
    CmsDemo.start.getInfo();
    CmsDemo.start.onstart();
    CmsDemo.module.imgplayer();
});
/*
jQuery.wurui = function() { alert("wurui!"); }
jQuery.extend({
min: function(a, b) { return a < b ? a : b; },
max: function(a, b) { return a > b ? a : b; }
});*/
var fn = function() { };

var CmsDemo = fn.prototype = {
    _currentData: "",
    _currentstyle: "newstyle", //当前的样式
    _layout: "13", //当前的布局
    _currentObj: null, //编辑单个模块的样式时，这个记录当前编辑模块
    _titleSpan: null, //存放标题的span
    _prevSytle: null, //记录修改之前的样式，注意在对话框关闭时要设置为空
    _prevTitle: null, //记录修改之前的标题,注意在对话框关闭时要设置为空
    launch: function(layout)
    {
        if (layout)
        {
            CmsDemo._layout = layout;
            CmsDemo.handler.setLayout(layout);
        }
        else
        {
            layout = CmsDemo._layout;
        }
        CmsDemo.module.imgplayer();

        var items = $("#content div.mode_box");
        if (layout == "free")//选择自由布局
        {
            $("#content>div").mysort("destroy");
            items.mydrag({});
            items.myresize({ container: $('#content') });
            items.each(function(i)
            {
                if ($(this).css("position") != 'absolute')
                {
                    var objtemp = $(this),
                    objparent = objtemp.offsetParent(),
             pleft = objparent.offset().left,
            ptop = objparent.offset().top,
                    w = objtemp.width(),
                     h = objtemp.height(),
                     l = objtemp.offset().left - pleft - parseInt(objtemp.css("margin-left").replace("px", "")),
                     t = objtemp.offset().top - ptop - parseInt(objtemp.css("margin-top").replace("px", ""));
                    objtemp.css({ width: w, height: h }); //屏敝myresize的bug
                    objtemp.css({ left: l + "px", top: t + "px" });
                }

            });

            //++++++++++++++++++++++----------------------------- master module operation
            var moveInto = $("#moveInto"), secondMenu = null;
            secondMenu = CmsDemo.module.showSecondMenu();

            items.bind('contextmenu', function()
            {
                if (CmsDemo._currentObj)
                    CmsDemo._currentObj.find(".hilight").hide();
                CmsDemo._currentObj = $(this);
                $("#singleModule").hide();

            }).contextMenu("contextMenu", {
                bindings: {
                    'toTop': function(t)
                    {
                        CmsDemo.handler.setLayer($(t), "top");
                        $(document).click();
                    },
                    'toBottom': function(t)
                    {
                        CmsDemo.handler.setLayer($(t), "bottom");
                        $(document).click();
                    },
                    'toUpper': function(t)
                    {
                        CmsDemo.handler.setLayer($(t), "up");
                        $(document).click();
                    },
                    'toLower': function(t)
                    {
                        CmsDemo.handler.setLayer($(t), "down");
                        $(document).click();
                    },
                    'remove': function(t)
                    {
                        if (confirm("确定要移除此模块以及模块内的所有内容？"))
                        {
                            $(t).remove();
                            CmsDemo._currentObj = null;
                            CmsDemo.launch();
                            $(document).click();
                        }
                    },
                    'moveInto': function(t)
                    {
                        $(document).click();
                    },
                    'moveOut': function(t)
                    {
                        $("#content>div.col0").append(CmsDemo._currentObj);
                        $(document).click();
                    }
                },
                onContextMenu: function()//A custom event function which runs before the context menu is displayed. If the function returns false the menu is not displayed. This allows you to attach the context menu to a large block element (or the entire document) and then filter on right click whether or not the context menu should be shown.
                {
                    if (CmsDemo._layout == 'free')
                    {
                        if (CmsDemo.tools.isMaster(CmsDemo._currentObj))//判断是否母版
                        {
                            moveInto.css({ height: "0", visibility: "hidden", padding: "0" });
                        }
                        else
                        {
                            //moveInto.css({ height: "", padding: "", visibility: "visible" });

                            if (CmsDemo.tools.isMaster(CmsDemo._currentObj.parent().parent()))//判断是否在母版内
                            {
                                moveInto.css({ height: "0", visibility: "hidden", padding: "0" });
                                $("#moveOut").css({ height: "", padding: "", visibility: "visible" });
                            }
                            else
                            {
                                moveInto.css({ height: "", padding: "", visibility: "visible" });
                                $("#moveOut").css({ height: "0", visibility: "hidden", padding: "0" })
                            }
                        }

                        return true;
                    }
                    else
                        return false;
                },
                onShowMenu: function(e, menu)//A custom event function which runs before the menu is displayed. It is passed a reference to the menu element and allows you to manipulate the output before the menu is shown. This allows you to hide/show options or anything else you can think of before showing the context menu to the user. This function must return the menu.
                {
                    $(document).one("click", function()
                    {
                        $("#content div[id^='master_']").children("[name='sign']").hide();
                        if (secondMenu)
                            secondMenu.hide();
                    });
                    return menu;
                }
            });
            //+++++++++++++++++++++++--------------------------------------end
            items.css({ position: "absolute" });
        }
        else
        {
            $("#content div.mode_box").mydrag("destroy");
            $("#content div.mode_box").myresize('destroy');
            $("#content>div>div").css({ position: "", left: "", right: "", top: "", bottom: "", width: "", height: "" }); // this one need redo!!!!
            $("#content>div").mysort({});
        }
        CmsDemo.module.hilight();
    },
    event: function()//注册事件
    {
        var chl = $("#changeLayout"),
        ct = $("#content"),
        tags = $("#changeLayout dl dd"),
        isopen = false; //操作区域是否打开
        //点击更换标签
        tags.click(function()
        {
            tags.removeClass("now");
            $(this).addClass("now");
            $("#changeLayout>div>div").addClass("nodisplay").eq(tags.index(this)).removeClass("nodisplay");
        });
        //点击更换主题
        var stylebtn = $("#divstyle a");
        stylebtn.click(function()
        {
            stylebtn.removeClass("selected");
            $(this).addClass("selected");
            var st = this.id;
            $("#style").attr("href", "../theme/" + st.substr(0, st.length - 5) + "/css/" + st + ".css");
            CmsDemo._currentstyle = st;
            return false; //it's very important for ie6
        });
        //点击自定义
        $("#aChangeLayout").click(function()
        {
            if (isopen) return false;
            isopen = true;
            $("#changeLayout a").removeClass("selected");
            $("#" + CmsDemo._currentstyle).addClass("selected");
            $("#layout-" + CmsDemo._layout).addClass("selected")
            CmsDemo.launch(CmsDemo._layout);
            $("#content .btnedit").removeClass("nodisplay");
            $("#content div[id^='master_'] .btnrecover").show();
            chl.slideDown();
            return false;
        });
        //关闭选择布局
        $("#aclose").click(function()
        {
            if (confirm("页面没有保存，要保存吗？"))
                $("#asave").trigger("click");
            else
            {
                $("#content>div").mysort("destory");
                $(".btnedit").addClass("nodisplay");
                $("#content .btnrecover").remove();
                CmsDemo.start.getInfo();
            }
            chl.slideUp();
            isopen = false;
            return false;
        });
        //选择布局
        var layoutbtn = $("#changeLayout a.layout-btn"), lastclickid;
        layoutbtn.mousedown(CmsDemo.tools.showLoading);
        layoutbtn.click(function()
        {
            if (lastclickid == this.id)
            {
                CmsDemo.tools.hideLoading();
                return;
            }
            lastclickid = this.id;
            var layout = this.id.split("-")[1];
            CmsDemo.launch(layout);
            layoutbtn.removeClass("selected");
            $(this).addClass("selected");
            CmsDemo.tools.hideLoading();
            return false;

        });
        //点击保存当前页面
        $("#asave").click(function()
        {
            var cols = $("#content>div");
            var laycols = "["; // [{ "models": [{ "id": "model11", "style": "background-color:red", "title": "模块1" }, { "id": "model12", "style": "background-color:red", "title": "模块2"}] }, { "models": [{ "id": "model31", "style": "background-color:red", "title": "模块3" }, { "id": "model32", "style": "background-color:red", "title": "模块4"}]}]
            for (var i = 0; i < cols.length; i++)
            {
                laycols += "{models:[";
                var oc = cols.eq(i).children("div");
                for (var j = 0; j < oc.length; j++)
                {
                    var id = oc.eq(j)[0].id;
                    var style = oc.eq(j).attr("style") || "";
                    var title1 = $.trim(oc.eq(j).children(".mode_title,.master_title").children("div").eq(0).text().replace('\n', '').replace('\r', ''));
                    var title2 = $.trim(oc.eq(j).children(".mode_title,.master_title").children("div").eq(1).text().replace('\n', '').replace('\r', ''));
                    var titledisplay = oc.eq(j).children(".mode_title,.master_title").css("display");
                    laycols += "{ \"id\": \"" + id + "\", \"style\": \"" + style + "\", \"title1\": \"" + title1 + "\",\"title2\":\"" + title2 + "\",\"titledisplay\":\"" + titledisplay + "\" },";
                }
                laycols = laycols.substr(0, laycols.length - 1);
                laycols += "]},";

            }
            laycols = laycols.substr(0, laycols.length - 1);
            laycols += "]";
            var data = "{\"version\":\"v1\", \"layout\": \"" + CmsDemo._layout + "\", \"contentstyle\":\"" + ($("#content").attr("style") || "") + "\", \"style\":\"" + CmsDemo._currentstyle + "\", \"laycols\": " + laycols + " }";
            $.cookie("pageinfo", data, { "expires": 2 }); //页面模块的样式
            $.cookie("content", $("#content").attr("style"), { "expires": 2 }); //内容的样式

            //$("#content div[id^='master_']")
            //{master_id:[{title:title,content_id:divid},{},{}]}
            //$.cookie();//母版的内容
            CmsDemo.handler.pageData();

            alert("保存成功！"); chl.slideUp();

            $("#content .btnedit").addClass("nodisplay");
            $("#content div[id^='master_'] .btnrecover").hide();
            $("#content div.mode_box").mydrag("destroy");
            $("#content div.mode_box").myresize('destroy');
            $("#content>div").mysort("destroy");
            isopen = false;
            return false;

        });
        //------------------------------------------------------------------->>编辑单个模块的样式
        //---------------点击选择颜色
        $("#txtColor").ColorPicker({
            onSubmit: function(hsb, hex, rgb, el)
            {
                $("#txtColor").val(hex);
                $(el).ColorPickerHide();
            },
            onBeforeShow: function()
            {
                $("#txtColor").ColorPickerSetColor(this.value);
            }
        });
        //-----------点击预览
        $("#btnView").click(function()
        {
            var title = $.trim($("#txtTitle").val());
            var color = $.trim($("#txtColor").val());
            var opts = {};
            if (color)
            {
                if (CmsDemo.tools.isMatchColor(color))
                {
                    $.extend(opts, { color: "#" + color });
                } else
                {
                    alert("颜色值格式不正确！");
                    return;
                }
            }
            CmsDemo.handler.setStyle(CmsDemo._currentObj, title, opts);
        });
        //  --------  点击取消
        $("#btnCancel").click(function()
        {
            if (CmsDemo._prevSytle)
            {
                CmsDemo._currentObj.attr("style", CmsDemo._prevSytle);
            }
            if (CmsDemo._prevTitle)
            {
                CmsDemo._titleSpan.text(CmsDemo._prevTitle);
            }
            CmsDemo._currentObj = null;
            CmsDemo._titleSpan = null;
            CmsDemo._prevSytle = null;
            CmsDemo._prevTitle = null;
        });
        //  -----------点击保存
        $("#btnSave").click(function()
        {
            var title = $.trim($("#txtTitle").val());
            var color = $.trim($("#txtColor").val());
            var opts = {};
            if (color)
            {
                if (CmsDemo.tools.isMatchColor(color))
                {
                    $.extend(opts, { color: "#" + color });
                } else
                {
                    alert("颜色值格式不正确！");
                    return;
                }
            }
            CmsDemo.handler.setStyle(CmsDemo._currentObj, title, opts);
            CmsDemo._currentObj = null;
            CmsDemo._titleSpan = null;
            CmsDemo._prevSytle = null;
            CmsDemo._prevTitle = null;
            var callback = function() { }
            jDClose(callback);
        });

    },
    module: {
        _editObj: null,
        _menuleft: false, //记录显示的菜单是否在左边
        addTab: function(id, tabindex, obj)//增加内容页 id为当前母版的id tabindex 代表第几位 obj为当前操作对象（可不填）
        {
            var addObj = CmsDemo._currentObj;
            if (obj)
            {
                addObj = obj;
            }
            if (!tabindex)
                tabindex = 0;
            if (!addObj) return;
            var contentObj = addObj.children("[id^='box_body']"), //内容
            titleObj = $.trim(addObj.children(".mode_title,.master_title").children("div").text()),
            masterObj = $("#" + id),
            masterTitle = masterObj.children(".master_title"), //母版的标题
            contents = masterTitle.siblings("[id^='mode_box']"); //tab母版下 内容的块

            if (id.indexOf("_tab") > 0)//tab 标签的模版
            {
                if (!titleObj)
                    titleObj = "tag";
                titleObj = "<a href='javascript:' style='position:relative' class='mastertabs'><span onclick='CmsDemo.module.recoverModule(this);return false;' class='btnrecover'></span>" + titleObj + "</a>";
                //--------------------------
                // addObj.children(".mode_title,.master_title").hide();
                var tempID = addObj.attr("id");
                var newObj = $("<div id='" + tempID + "'></div>");
                newObj.append(addObj.children(".mode_title,.master_title").hide()).append(contentObj);
                contentObj = newObj;

                if (tabindex > 1)
                {
                    masterTitle.children("a").eq(tabindex - 2).after(titleObj);
                    contents.eq(tabindex - 2).after(contentObj);
                }
                else if (tabindex == 1)
                {
                    masterTitle.after(contentObj).prepend(titleObj);
                }
                else
                {

                    if (masterTitle.children("a:last").length > 0)
                    {
                        masterTitle.children("a:last").after(titleObj);
                    }
                    else
                    {
                        masterTitle.append(titleObj);
                    }
                    if (contents.length > 0)
                    {
                        contents.eq(contents.length - 1).after(contentObj);
                    }
                    else
                    {
                        masterTitle.after(contentObj)
                    }
                }
                var tabs = masterTitle.children("a");
                tabs.unbind("click").click(function()
                {
                    tabs.removeClass("mastertabs_clicked");
                    $(this).addClass("mastertabs_clicked");
                    masterTitle.siblings("[id^='mode_box']").hide().eq(tabs.index(this)).show();
                });
                if (CmsDemo._currentObj)
                {
                    CmsDemo._currentObj.remove();
                }
                else
                    masterObj.find(".btnrecover").hide();
                if (tabindex > 1)
                {
                    tabs.eq(tabindex - 1).click();
                }
                else if (tabindex == 1)
                {
                    tabs.eq(0).click();
                }
                else
                {
                    tabs.eq(tabs.length - 1).click();
                }
            }
            else if (id.indexOf("_tb") > 0)//上下的模版
            {
                var btnRecover = "<div class='btnrecover' onclick='CmsDemo.module.recoverModule(this,1)'></div>";
                if (tabindex == 1)
                    masterObj.children(".mastertop").append(contentObj).append(btnRecover);
                else if (tabindex == 2)
                    masterObj.children(".masterbottom").append(contentObj).append(btnRecover);
                addObj.remove();
                CmsDemo._currentObj = null;
            }
            else if (id.indexOf("_lr") > 0)//左右的模版
            {
                var btnRecover = "<div class='btnrecover' onclick='CmsDemo.module.recoverModule(this,1)'></div>";
                if (tabindex == 1)
                    masterObj.children(".masterleft").append(contentObj).append(btnRecover);
                else if (tabindex == 2)
                    masterObj.children(".masterright").append(contentObj).append(btnRecover);
                addObj.remove();
                CmsDemo._currentObj = null;
            }
            else if (id.indexOf("_grp") > 0)//如果是组模版
            {
                masterObj.children(".masterbody").append(addObj.css({ top: 0, left: 0 }));
            }
        },
        showSecondMenu: function()//展现右键第二级菜单
        {
            var masters = $("#content div[id^='master_']"),
             moveInto = $("#moveInto"),
             menulists = $("#contextMenu li"),
             indexli = menulists.index(moveInto[0]),
             secondMenu = null;
            $("#secondMenu").remove();
            if (masters.length > 0)
            {
                var vhtm = "<div id='secondMenu' style='width:100px;position:absolute;z-index:10;display:none;'><ul style='border: 1px solid #888888; margin: 0px; padding: 1px; list-style-type: none; list-style-image: none; list-style-position: outside; background-color: #ffffff; width: 100px;'>";
                masters.each(function(i)
                {
                    var temp = $(this), index = this.id.split("no")[1];
                    if (temp.children("[name='sign']").length == 0)//添加标签
                        temp.append("<div name='sign' style='text-align:center;position:absolute;height:22px;width:50px;background:#000000;top:0;right:0;display:none;color:#00ffff;font-size:20px;font-weight:700;z-index:3;'>" + index + "</div>");

                    vhtm += "<li onmouseover='CmsDemo.module.showThirdMenu(\"" + this.id + "\",this)'>" + index + "</li>";

                });
                vhtm += "</ul></div>";
                secondMenu = $(vhtm);
                var lis = secondMenu.children().children().css({ "padding": "3px", "border": "1px solid #FFFFFF" });
                lis.hover(function()
                {
                    $(this).css({ background: "#B6BDD2", "border-color": "#0A246A" });
                }, function()
                {
                    $(this).css({ background: "#FFFFFF", "border-color": "#FFFFFF" });
                });
                moveInto.css({ height: "", visibility: "visible" });
                menulists.unbind("mouseover").mouseover(function(e)
                {
                    if (this.id == 'moveInto')
                    {
                        var temp = $(this),
                l = temp.offset().left + temp.outerWidth(),
                t = temp.offset().top;
                        if (l + temp.outerWidth() * 2 > $(window).width())//三个菜单宽度相加(前提是三个菜单宽度相等)
                        {
                            CmsDemo.module._menuleft = true;
                            l = temp.offset().left - temp.outerWidth();
                        }
                        else
                            CmsDemo.module._menuleft = false;
                        secondMenu.css({ left: l + "px", top: t + "px" }).appendTo("body").show();
                        masters.children("[name='sign']").show();
                    }
                    else
                    {
                        if (secondMenu) secondMenu.hide(1, function() { $("#thirdMenu").remove(); });
                        masters.children("[name='sign']").hide();
                    }
                });
            } else
            {
                moveInto.css({ height: 0, visibility: "hidden" });
            }
            return secondMenu;
        },
        showThirdMenu: function(id, obj)//展现右键第三级菜单 id 为母模块的id,obj为当前点击的对象
        {
            $("#thirdMenu").remove();
            var masterObj = $("#" + id), liObj = $(obj),
            vhtm = "<div id='thirdMenu' style='width:100px;position:absolute;z-index:10;display:none;'><ul style='border: 1px solid #888888; margin: 0px; padding: 1px; list-style-type: none; list-style-image: none; list-style-position: outside; background-color: #ffffff; width: 100px;'>";
            if (id.indexOf("_tab") > 0)//如果是有tab页的模版
            {
                var tabs = masterObj.children(".master_title").children("a");
                tabs.each(function(i)
                {
                    i++;
                    vhtm += "<li onclick='CmsDemo.module.addTab(\"" + id + "\",\"" + i + "\")'>第" + i + "位</li>";
                });
                var temp = tabs.length + 1;
                vhtm += "<li onclick='CmsDemo.module.addTab(\"" + id + "\",\"" + temp + "\")'>第" + temp + "位</li>";
            }
            else if (id.indexOf("_tb") > 0)//如果是上下的模版
            {
                if (masterObj.children(".mastertop").children("[id^='box_body']").length == 0)
                    vhtm += "<li onclick='CmsDemo.module.addTab(\"" + id + "\",\"" + 1 + "\")'>上</li>";
                if (masterObj.children(".masterbottom").children("[id^='box_body']").length == 0)
                    vhtm += "<li onclick='CmsDemo.module.addTab(\"" + id + "\",\"" + 2 + "\")'>下</li>";
            }
            else if (id.indexOf("_lr") > 0)//如果是左右的模版
            {
                if (masterObj.children(".masterleft").children("[id^='box_body']").length == 0)
                    vhtm += "<li onclick='CmsDemo.module.addTab(\"" + id + "\",\"" + 1 + "\")'>左</li>";
                if (masterObj.children(".masterright").children("[id^='box_body']").length == 0)
                    vhtm += "<li onclick='CmsDemo.module.addTab(\"" + id + "\",\"" + 2 + "\")'>右</li>";
            }
            else if (id.indexOf("_grp") > 0)//如果是组模版
            {
                vhtm += "<li onclick='CmsDemo.module.addTab(\"" + id + "\",\"" + 1 + "\");$(document).click();'>点击添加到组</li>";
            }
            vhtm += "</ul></div>";
            var l = 0,
            t = liObj.offset().top;
            if (CmsDemo.module._menuleft)
            {
                l = liObj.offset().left - liObj.outerWidth()
            }
            else
            {
                l = liObj.offset().left + liObj.outerWidth()
            }
            thirdMenuObj = $(vhtm).css({ left: l + "px", top: t + "px" }).appendTo("body").show();

            var lis = thirdMenuObj.children().children().css({ "padding": "3px", "border": "1px solid #FFFFFF", cursor: "pointer" });
            lis.hover(function()
            {
                $(this).css({ background: "#B6BDD2", "border-color": "#0A246A" });
            }, function()
            {
                $(this).css({ background: "#FFFFFF", "border-color": "#FFFFFF" });
            });

            $(document).one("click", function()
            {
                thirdMenuObj.remove();
            });
        },
        recoverModule: function(obj, type)//移出模块 obj为按钮 type 代表母版类型,不填默认为tab页 1为上下或左右模块 2为组模块
        {
            if (typeof (obj) != 'object')
                return;
            if (type == 1)
            {
                var contentObj = $(obj).siblings("[id^='box_body']"),
                areaObj = $(obj).parent().parent().parent();
                var htmObj = $("<div id='" + contentObj[0].id.replace("box_body", "mode_box") + "' style='min-width:100px;_height:100px;_width:100px;min-height:100px;position:absolute;' class='mode_box'><div class='mode_title'></div><div></div></div>");
                areaObj.append(htmObj);
                htmObj.children(".mode_title").after(contentObj);
                CmsDemo.launch();
                $(obj).remove();
            }
            else if (type == 2)
            {
                alert("!");
            }
            else
            {
                var tabObj = $(obj).parent(),
            titleObj = tabObj.parent(),
            tabObjs = titleObj.children(),
            contentObjs = titleObj.siblings("[id^='mode_box']"),
            contentObj = contentObjs.eq(tabObjs.index(tabObj[0]));
                areaObj = titleObj.parent().parent();
                $(obj).remove();
                var htmObj = $("<div id='" + contentObj[0].id.replace("box_body", "mode_box") + "' style='min-width:100px;_height:100px;_width:100px;min-height:100px;position:absolute;' class='mode_box'><div class='mode_title'><div>" + tabObj.text() + "</div></div><div></div></div>");
                htmObj = contentObj.css({
                    'min-width': '100px',
                    '_height': '100px',
                    '_width': '100px',
                    'min-height': '100px',
                    'position': 'absolute',
                    'display': 'block'
                }).addClass("mode_box")
                contentObj.children(".mode_title").show(); //.prepend("<div class='mode_title'><div>" + tabObj.text() + "</div></div>");
                areaObj.append(htmObj);
                //htmObj.children(".mode_title").after(contentObj.show());
                tabObj.remove();
                CmsDemo.launch();
                tabObjs = titleObj.children("a");
                tabObjs.unbind("click").click(function()
                {
                    tabObjs.removeClass("mastertabs_clicked");
                    $(this).addClass("mastertabs_clicked");
                    titleObj.siblings("[id^='mode_box']").hide().eq(tabObjs.index(this)).show();
                });
                if (tabObj.length > 0)
                    tabObj.eq(0).click();
            }
        },
        event: function()
        {
            CmsDemo.module.implement();

            //--------------管理图片播放器
            $("#fsImgplayer a").click(function()
            {
                CmsDemo.handler.setPlayer($(this).attr("class"));
            });
            $("#addPlayer").click(function()//添加一张图片
            {
                var bigImg = $.trim($("#txtBigImg").val()),
            smallImg = $.trim($("#txtSmallImg").val()),
            detail = $.trim($("#txtImgDetail").val()),
            title = $.trim($("#txtImgTitle").val()),
            linkto = $.trim($("#txtImgLink").val());
                var oUl = $("#featured .ui-tabs-nav");
                if (smallImg && bigImg && detail && title && linkto)
                {
                    var vimg = "<img src='" + bigImg + "' alt='' />";
                    var vinfo = "<div class='info'><h2><a href='#'>" + title + "</a></h2><p>" + detail + "</p></div>";
                    var li = "<li id='nav-fragment-5' class='ui-tabs-nav-item ui-tabs-selected'><a href='#fragment-5'><img src='" + smallImg + "' alt='' /><span class='nav_index'>" + (oUl.children().length - 2) + "</span><span class='nav_title'>" + title + "</span></a></li>"
                    var vbig = "<div id='fragment-5' class='ui-tabs-panel ui-tabs-hide'>" + vimg + vinfo + "</div>";
                    oUl.before(vbig).children(".next").before(li);
                    //$("#featured > ul").tabs("destory");
                    $("#featured > ul").tabs().tabs("rotate", 3000, true);
                    //CmsDemo.module.imgplayer();
                }
                else
                {
                    alert("信息不全！");
                }

            });
            $("#txtFile").blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                {
                    var editObj = CmsDemo._currentObj.children("[id^='box_body']").find("embed")
                    if (editObj.length > 0)
                        editObj.attr("src", v);

                }

            });
            //----------------------------------------

            //--------------模块管理

            //----------------------------
            //----------------------------添加模块
            $("#divmodules a").click(function()
            {//mode_box1_7
                var i = 0;

                $("#content div[id^='mode_box1_']").each(function()
                {
                    var temp = parseInt(this.id.split("_")[2])
                    if (temp > i)
                    {
                        i = temp;
                    }
                });
                i++;
                var vcontent = "";
                var vembed = "";

                switch (this.id)
                {
                    case "videoplayer":
                        vembed = "<embed height='350' width='425' wmode='transparent' quality='high' name='flvvideo' id='flvvideo' style='' src='http://www.metacafe.com/fplayer/386357/.swf' type='application/x-shockwave-flash' /></div>";
                        vcontent = "<div id='box_body1_" + i + "'>" + vembed + "</div>";
                        break;
                    case "imgplayer":
                        vcontent = $("#box_body1_imgplayer").html(); $("#box_body1_imgplayer").empty();
                        break;
                    case "flashplayer":
                        vembed = "<embed height='100' width='625' wmode='transparent' quality='high' name='flvvideo' id='flvvideo' style='' src='http://d2.sina.com.cn/200907/02/181070_sy-dt.swf' type='application/x-shockwave-flash' /></div>";
                        vcontent = "<div id='box_body1_" + i + "'>" + vembed + "</div>";
                        break;
                }
                var vhtml = "<div id='mode_box1_" + i + "' class='mode_box'><div class='mode_title'> <div class='title001'>title " + i + "1</div><div class='title002'>title " + i + "2</div></div><div id='box_body1_" + i + "'>" + vcontent + "</div></div>";
                $("#content").children("div:last").append(vhtml);
                if (this.id == "imgplayer")
                    CmsDemo.module.imgplayer();
                CmsDemo.launch();
            });
            //----------------------------添加母版
            $("#divmastermodules a").click(function()
            {
                var masterHtml = "";
                var i = 0;
                $("#content div[id^='master']").each(function()
                {
                    var temp = parseInt(this.id.split("no")[1])
                    if (temp > i)
                    {
                        i = temp;
                    }
                });
                i++;
                switch (this.id)
                {//母版模块的命名规则：master_lr_no1 第一个下载划线后面的字符代表类型 no后面的数字代表唯一编号
                    case "lr":
                        masterHtml = "<div id=\"master_lr_no" + i + "\" class=\"master_box mode_box\"><div class=\"master_title\"><div class='title001'>master " + i + "</div><div class='title002'></div></div><div class='masterleft'><div class='btnedit' onclick=\"CmsDemo.handler.showDialog(this)\"></div></div><div class='masterright'><div class='btnedit' onclick=\"CmsDemo.handler.showDialog(this)\"></div></div></div>";
                        break;
                    case "tb":
                        masterHtml = "<div id=\"master_tb_no" + i + "\" class=\"master_box mode_box\"><div class=\"master_title\"><div class='title001'>master " + i + "</div><div class='title002'></div></div><div class='mastertop'><div class='btnedit' onclick=\"CmsDemo.handler.showDialog(this)\"></div></div><div class='masterbottom'><div class='btnedit' onclick=\"CmsDemo.handler.showDialog(this)\"></div></div></div>";
                        break;
                    case "tab":
                        masterHtml = "<div id=\"master_tab_no" + i + "\" class=\"master_box mode_box\"><div class=\"master_title\"></div></div>";
                        break;
                    case "grp":
                        masterHtml = "<div id=\"master_grp_no" + i + "\" class=\"master_box mode_box\"><div class=\"master_title\"><div class='title001'>master " + i + "</div><div class='title002'></div></div><div class='masterbody'></div></div>";
                        break;
                }
                $("#content>div:last").append(masterHtml);
                CmsDemo.launch();
                CmsDemo.module.hilight();
                return false;
            });
            //----------------------------------------

            //-------------- 模块样式管理

            //----------------------------

            //    ----------effects
            var singleModule = $("#singleModule"), t = setTimeout("", 1), isOver = true, smH = singleModule.height(), tagsH = $("#tags").outerHeight(); //操作区域
            $("#btnModuleCancel").click(function()
            {
                $(".hilight").remove();
                isOver = false;
                singleModule.hide();
            });
            $("#content span.btnedit").click(function()
            {
                singleModule.show();
            });
            if ($.browser.msie && $.browser.version == '6.0')
            {
                singleModule.css({ position: 'absolute' });
                $(window).scroll(function()
                {
                    var t = $(window).scrollTop();
                    singleModule.animate({ top: t }, 1);
                });
            }
            var tagscontent = $("#tagscontent>div"), tags = $("#tags a");
            tags.each(function(i)
            {
                $(this).click(function()
                {
                    tags.removeClass("clicked");
                    $(this).addClass("clicked").blur();
                    tagscontent.addClass("nodisplay");
                    tagscontent.eq(i).removeClass("nodisplay");
                });
            });
            var tempindex = 0, txtcolor = $("#singleModule input:[name='txtColor']"), btncolor = $(".clickcolor");
            btncolor.mousedown(function()
            {
                tempindex = btncolor.index(this);
            }).ColorPicker({//选择颜色的控件
                onSubmit: function(hsb, hex, rgb, el)
                {
                    txtcolor.eq(tempindex).val(hex).trigger("blur");
                    $(el).ColorPickerHide();
                }
            });
            //apply to all
            $("#singleModule input:[name='apptoall']").click(function()
            {
                $(this).parent().siblings().children("input:gt(0)").attr("disabled", $(this).attr("checked"));
            });
            /////--------------my select
            var opt = null, bg, objtxt = null, optcontainer = $("#singleModule .opt"), selects = $("#singleModule input:[name='opt'],#singleModule input:[name='borderopt']");
            selects.click(function()
            {
                optcontainer.hide();
                if (this.name == 'borderopt')
                {
                    opt = $("#border-styleopts"); //当前的选择项
                }
                else
                    opt = $("#" + this.id + "opts");
                objtxt = $(this);
                var zindex = 10000,
            w = objtxt.outerWidth(),
            h = 'auto',
            l = objtxt.offset().left - objtxt.offsetParent().offset().left,
            t = objtxt.offset().top + objtxt.outerHeight() - objtxt.offsetParent().offset().top;
                opt.css({ 'background': '#fff', position: 'absolute', 'z-index': zindex, width: w + "px", height: h, left: l + "px", top: t + "px" }).show();
                return false;
            });

            optcontainer.children().hover(function()//选择项的鼠标效果
            {
                $(this).addClass("opt_hover");
            }, function()
            {
                $(this).removeClass("opt_hover");
            }).click(function()
            {
                if (objtxt)
                    objtxt.val($.trim($(this).text())).trigger("blur");

            });
            $(document).click(function()
            {
                if (opt)
                {
                    opt.hide();
                    opt = null;
                }
            });

        },
        hilight: function()
        {
            $("#content div.mode_box").each(function(i)
            {
                var temp = $(this);
                if (temp.css("position") != 'absolute')
                    temp.css("position", 'relative');

                var edit = $("<div class='btnedit' style='position:absolute;top:0;right:0;' onclick='CmsDemo.handler.showDialog(this)'></div>");
                if (temp.children(".btnedit").length == 0)
                    temp.append(edit);
            });
            var objcontent = $("#content");
            if (objcontent.children(".btnedit").length == 0)
                objcontent.append("<span class='btnedit' style='position:absolute;border:solid 1px;display:block;right:0;bottom:0;top:100%' onclick='CmsDemo.handler.showDialog(this)'></span>");
        },
        implement: function()//-------------- implement
        {
            //var Obj = CmsDemo._currentObj; this one is very interesting!!!
            $("input[id^='txtTitleContent']").blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                    CmsDemo._currentObj.children(".mode_title,.master_title").children("." + this.id.replace('txtTitleContent', 'title')).html(v);
            });
            //title
            $("#rdbTitleShow,#rdbTitleHide").click(function()
            {
                if ($("#rdbTitleHide").attr("checked"))
                {
                    CmsDemo._currentObj.children(".mode_title,.master_title").hide();
                }
                else
                {
                    CmsDemo._currentObj.children(".mode_title,.master_title").show();
                }

            });
            $("input[id^='RadioTitleHide']").click(function()
            {
                if ($(this).attr("checked"))
                {
                    CmsDemo._currentObj.children(".mode_title,.master_title").children("." + this.id.replace('RadioTitleHide', 'title')).hide();
                }
            });
            $("input[id^='RadioTitleShow']").click(function()
            {
                if ($(this).attr("checked"))
                {
                    CmsDemo._currentObj.children(".mode_title,.master_title").children("." + this.id.replace('RadioTitleShow', 'title')).show();
                }
            });
            //--------------background
            $("#txtbgColor").blur(function()
            {
                var v = $.trim($(this).val());
                if (v == "")
                    CmsDemo._currentObj.css("background-color", "");
                if (v && CmsDemo.tools.isMatchColor(v))
                    CmsDemo._currentObj.css("background-color", '#' + v);
            });
            $("#txtbgPath").blur(function()
            {
                var v = $.trim($(this).val());
                if (v == "")
                    CmsDemo._currentObj.css("background-image", "none");
                if (v)
                    CmsDemo._currentObj.css("background-image", "url(" + v + ")");
            });
            $("#txtbgHorizontal,#txtbgVertical").blur(function()
            {
                var bgPosH = $.trim($("#txtbgHorizontal").val()), bgPosV = $.trim($("#txtbgVertical").val());
                if (bgPosH)
                    bgPosH += "px ";
                else bgPosH = "left ";
                if (bgPosV)
                    bgPosV += "px";
                else bgPosV = "top";
                CmsDemo._currentObj.css("background-position", (bgPosH + bgPosV));
            });

            $("#bgrepeat").blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                    CmsDemo._currentObj.css("background-repeat", v);
            });

            //---------border  BS is short for border-style BC border-color BW border-width
            $("#txtBStop").attr("disabled", false).blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                {
                    if ($("#ckbborderstyle").attr("checked"))
                        CmsDemo._currentObj.css("border-style", v);
                    else
                        CmsDemo._currentObj.css("border-top-style", v);
                }
            });
            $("#txtBSbottom").blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                {
                    CmsDemo._currentObj.css("border-bottom-style", v);
                }
            });
            $("#txtBSleft").blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                {
                    CmsDemo._currentObj.css("border-left-style", v);
                }
            });
            $("#txtBSright").blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                {
                    CmsDemo._currentObj.css("border-right-style", v);
                }
            });

            $("#txtBCtop").attr("disabled", false).blur(function()
            {
                var v = $.trim($(this).val());
                if (v == "")
                {
                    if ($("#ckbbordercolor").attr("checked"))
                        CmsDemo._currentObj.css("border-color", "");
                    else
                        CmsDemo._currentObj.css("border-top-color", "");
                }
                else if (CmsDemo.tools.isMatchColor(v))
                {
                    if ($("#ckbbordercolor").attr("checked"))
                        CmsDemo._currentObj.css("border-color", '#' + v);
                    else
                        CmsDemo._currentObj.css("border-top-color", '#' + v);
                }
            });
            $("#txtBCbottom").blur(function()
            {
                var v = $.trim($(this).val());
                if (v == "")
                {
                    CmsDemo._currentObj.css("border-bottom-color", "");
                }
                else if (CmsDemo.tools.isMatchColor(v))
                {
                    CmsDemo._currentObj.css("border-bottom-color", '#' + v);
                }
            });
            $("#txtBCleft").blur(function()
            {
                var v = $.trim($(this).val());
                if (v == "")
                {
                    CmsDemo._currentObj.css("border-left-color", "");
                }
                else if (CmsDemo.tools.isMatchColor(v))
                {
                    CmsDemo._currentObj.css("border-left-color", '#' + v);
                }
            });
            $("#txtBCright").blur(function()
            {
                var v = $.trim($(this).val());
                if (v == "")
                {
                    CmsDemo._currentObj.css("border-right-color", "");
                }
                else if (CmsDemo.tools.isMatchColor(v))
                {
                    CmsDemo._currentObj.css("border-right-color", '#' + v);
                }
            });
            //text
            $("#font-style").blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                {
                    CmsDemo._currentObj.css("font-style", v);
                }
            });
            $("#font-weight").blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                {
                    CmsDemo._currentObj.css("font-weight", v);
                }
            });
            $("#text-decoration").blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                {
                    CmsDemo._currentObj.css("text-decoration", v);
                }
            });
            $("#font-size").blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                {
                    CmsDemo._currentObj.css("font-size", v + 'px');
                }
            });
            $("#txtColor").blur(function()
            {
                var v = $.trim($(this).val());
                if (v && CmsDemo.tools.isMatchColor(v))
                {
                    CmsDemo._currentObj.css("color", "#" + v);
                }
            });

            $("#txtLineheight").blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                {
                    CmsDemo._currentObj.css("line-height", v + "px");
                }
            });

            $("#text-align").blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                {
                    CmsDemo._currentObj.css("text-align", v);
                }
            });

            $("#txtWordSpacing").blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                {
                    CmsDemo._currentObj.css("word-spacing", v + "px");
                }
            });
            $("#txtLetterSpaceing").blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                {
                    CmsDemo._currentObj.css("letter-spacing", v + "px");
                }
            });
            $("#txtIndent").blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                {
                    CmsDemo._currentObj.css("text-indent", v + "px");
                }
            });
            $("#rdbShow,#rdbHide").click(function()
            {
                CmsDemo._currentObj.css("overflow", $("#rdbShow").attr("checked") ? "visible" : "hidden");
            })

            var hasinput = false,
                 cssname = null,
                 currentSpan = null,
                 tempVal = null,
                 input = $("<input type=\"text\" style='display:none;' />");

            input.click(function()
            {
                //return false;
            }).blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                {
                    CmsDemo._currentObj.css(cssname, v == 'auto' ? v : (v + 'px'));
                    tempVal = v;
                }
                $(this).appendTo("#divContent").hide();
                currentSpan.html(tempVal).css('z-index', 0);
                CmsDemo.handler.showHilight(CmsDemo._currentObj);
                hasinput = false;
                return false;
            });
            $("#divContent span[id!='offset']").click(function()
            {
                if (!hasinput || this.id != cssname)
                {
                    currentSpan = $(this);
                    tempVal = currentSpan.text();
                    cssname = this.id;
                    input.val(tempVal);
                    currentSpan.empty().css('z-index', 1).append(input.show(1, function()
                    {
                        input.focus();
                    }));
                    hasinput = true;
                }
                return true;

            });

        },
        imgplayer: function(o)
        {
            $("#featured > ul").tabs().tabs("rotate", 3000, true);
            if (o) return;
            $("#featured li.next").click(function()
            {
                $("#featured li.ui-tabs-selected").next().children("a").click();
            });
            $("#featured li.prev").click(function()
            {
                $("#featured li.ui-tabs-selected").prev().children("a").click();
            });
        }
    },
    handler: {
        setLayout: function(layout)
        {//设置页面的布局方式
            if (isNaN(layout))
            {
                layout = "1";
            }
            var ct = $("#content");
            //e.g:input 13 return col1_3  －－s 代表布局如13 121，prefix 样式的前缀
            var toClassName = function(s, prefix)
            {
                var classname = "ct"
                if (prefix)
                {
                    classname = prefix;
                }
                s = CmsDemo.tools.strToArr(s);
                for (var i = 0; i < s.length; i++)
                {
                    classname += s[i] + "_";
                }
                classname = classname.substr(0, classname.length - 1);
                return classname;
            }
            ct.removeClass().addClass(toClassName(layout));
            var len = ct.children("div").length; //容器当前列数
            if (len > layout.length)
            {
                var vhtm = "";
                for (var i = len - 1; i >= layout.length; i--)
                {
                    var objlast = $(".ui-sortable-selector").eq(i)
                    vhtm += objlast.html();
                    objlast.remove();
                }
                $(".ui-sortable-selector").eq(layout.length - 1).append(vhtm);
            }
            else if (len < layout.length)
            {
                var vhtm = "";
                for (var i = len; i < layout.length; i++)
                {
                    vhtm += "<div unselectable=\"on\" class=\"ui-sortable-selector col" + (i).toString() + "\"></div>";
                }
                ct.append(vhtm);
            }
            $("#content>div").mysort({});
        },
        setLayer: function(obj, oper)
        {//设置层的上下关系
            if (typeof (obj) != 'object')
                return;

            var objSiblings = obj.siblings(),
            objparent = obj.parent(),
            objprev = obj.prev().eq(0),
            objnext = obj.next().eq(0);

            switch (oper)
            {
                case "down":
                    if (objprev.length > 0)
                    {
                        for (var i = objSiblings.index(objprev[0]); i >= 0; i--)
                        {
                            if (CmsDemo.tools.isCover(objSiblings.eq(i), obj))
                            {
                                objSiblings.eq(i).before(obj);
                                break;
                            }
                        }
                    }
                    break;
                case "up":
                    if (objnext.length > 0)
                    {
                        for (var i = objSiblings.index(objnext[0]); i < objSiblings.length; i++)
                        {
                            if (CmsDemo.tools.isCover(objSiblings.eq(i), obj))
                            {
                                objSiblings.eq(i).after(obj);
                                break;
                            }
                        }
                    }
                    break;
                case "bottom":
                    if (objprev.length > 0)
                        objparent.prepend(obj);
                    break;
                case "top":
                    if (objnext.length > 0)
                        objparent.append(obj);
                    break;
                default:
                    break;
            }
        },
        setStyle: function(obj, title, styleOpts)
        {
            if (obj.length != 1)
                return;
            CmsDemo._titleSpan = CmsDemo._currentObj.children(".mode_title,.master_title").children("div");
            CmsDemo._prevSytle = CmsDemo._currentObj.attr("style");
            CmsDemo._prevTitle = CmsDemo._titleSpan.text();

            if (styleOpts)
                CmsDemo._currentObj.css(styleOpts);

            if (title)
                CmsDemo._titleSpan.text(title); //.children(".btnedit").html();
        },
        showadvancedstyle: function()
        {
            var objID = CmsDemo._currentObj.attr("id");
            $("#" + objID + "advancedstyle").remove();
            var objcss = "<style id=\"" + objID + "advancedstyle\" type=\"text/css\">";
            objcss += $("#advancedstyle").val();
            objcss += "</style>";

            $("head").append(objcss);
        },
        advancedstylehelp: function()
        {
            var objID = CmsDemo._currentObj.attr("id");
            var objcss = "#" + objID + "{}";

            $("#advancedstyle").val($("#advancedstyle").val() + objcss);
        },
        showBodyStyle1: function(objStyle)
        {
            CmsDemo._currentObj.children("div[id^='box_body']").children().removeClass();
            CmsDemo._currentObj.children("div[id^='box_body']").children().addClass("mode_news_box");
            CmsDemo._currentObj.children("div[id^='box_body']").children().addClass(objStyle);
        },
        showBodyStyle2: function(objStyle)
        {
            CmsDemo._currentObj.children("div[id^='box_body']").children().removeClass();
            CmsDemo._currentObj.children("div[id^='box_body']").children().addClass("mode_info_box");
            CmsDemo._currentObj.children("div[id^='box_body']").children().addClass(objStyle);
        },
        showTopDialog: function()
        {
            CmsDemo._currentObj = CmsDemo._currentObj.parents("div[id^='mode_box1']")
            CmsDemo.handler.showSingleModultTab(0);
            $(".icon_up").addClass("nodisplay");
            $("#content .hilight").hide();
            if (CmsDemo._currentObj.attr("id") != "content")
                CmsDemo._currentObj.find(".hilight").show();
            $("#singleModule input:text").val("");

            CmsDemo.handler.setCss();
            $("#singleModule").show();
        },
        hideSingleModultTab: function(index)
        {
            var tagscontent = $("#tagscontent>div"), tags = $("#tags a");
            tags.eq(index).addClass("nodisplay");
            tagscontent.eq(index).addClass("nodisplay");
            tags.eq(index + 1).addClass("clicked").blur();
            tagscontent.eq(index + 1).removeClass("nodisplay");
        },
        showSingleModultTab: function(index)
        {
            var tagscontent = $("#tagscontent>div"), tags = $("#tags a");
            tags.removeClass("nodisplay");
            tags.removeClass("clicked");
            tags.eq(index).addClass("clicked").blur();
            tagscontent.addClass("nodisplay");
            tagscontent.eq(index).removeClass("nodisplay");
        },
        showTitleDialog: function(id)
        {
            if (typeof (id) == 'string')
                CmsDemo._currentObj = CmsDemo._currentObj.children('.mode_title').children(id);
            else
                CmsDemo._currentObj = CmsDemo._currentObj.children('.mode_title');
            $("#content .hilight").hide();
            if (CmsDemo._currentObj.attr("id") != "content")
                CmsDemo._currentObj.find(".hilight").show();
            $("#singleModule input:text").val("");

            CmsDemo.handler.setCss();
            $("#singleModule").show();
            CmsDemo.handler.hideSingleModultTab(0);

            $(".icon_up").removeClass("nodisplay");
        },
        showHilight: function(obj)
        {
            return;
            if (!obj) return;
            $(".hilight").remove();
            var temp = obj;
            if (temp.css("position") != 'absolute')
                temp.css("position", 'relative');
            var hilight = $("<div class='hilight' style='position:absolute;z-index:1'></div>"),
                tempH = temp.outerHeight(),
                tempW = temp.outerWidth(),
                l = parseInt(temp.css('left').replace("px", "")) + parseInt(temp.css('margin-left').replace("px", "")) - 4,
                t = parseInt(temp.css('top').replace("px", "")) + parseInt(temp.css('margin-top').replace("px", "")) - 4,
                oParent = temp.offsetParent();
            hilight.css({
                left: l + 'px',
                top: t + 'px',
                width: tempW,
                height: tempH,
                border: "solid 1px #123456",
                padding: "3px"
            });
            oParent.append(hilight);
        },
        showDialog: function(id)
        {
            if (typeof (id) == 'string')
                CmsDemo._currentObj = $("#" + id);
            else
            {
                CmsDemo._currentObj = $(id).parent();
            }
            /*
            $("#content .hilight").hide();
            if (CmsDemo._currentObj.attr("id") != "content")
            CmsDemo._currentObj.find(".hilight").show();
            */
            /*JKL HTML BEGIN*/
            var templatebodyid = CmsDemo._currentObj.children("[id^='box_body']").attr("id");
            if (templatebodyid != null)
                htmTp.initcurrentObj(templatebodyid);
            /*JKL HTML END*/    
            $("#singleModule input:text").val("");
            $(".icon_up").addClass("nodisplay");
            CmsDemo.handler.showSingleModultTab(0);
            CmsDemo.handler.setCss();
            $("#singleModule").show();

            CmsDemo.handler.showHilight(CmsDemo._currentObj);
        },
        setCss: function()
        {
            try
            {
                var objID = CmsDemo._currentObj.attr("id");
                $("#advancedstyle").val($("#" + objID + "advancedstyle").text());
            }
            catch (e) { }
            var titleObj = CmsDemo._currentObj.children(".mode_title,.master_title");
            //绑定单个模块的样式数据
            //$("#txtTitleContent").val(titleObj.children("div").text())
            $("#txtTitleContent001").val(titleObj.children("div.title001").text())
            $("#txtTitleContent002").val(titleObj.children("div.title002").text())
            //title
            if (titleObj.css("display") == 'none')
            {
                $("#rdbTitleHide").attr("checked", true);
            }
            else
            {
                $("#rdbTitleShow").attr("checked", true);
            }

            //tab style
            $("#fsTabstyle input").click(function()
            {
                if (CmsDemo._currentObj.attr("id").indexOf("master_tab_") == 0)
                {
                    CmsDemo._currentObj.removeClass("mode_box_tab1").removeClass("mode_box_tab2").removeClass("mode_box_tab3")
                    switch (this.id.split("_")[2])
                    {
                        case "Left":
                            CmsDemo._currentObj.addClass("mode_box_tab2")
                            break;
                        case "Center":
                            CmsDemo._currentObj.addClass("mode_box_tab1")
                            break;
                        case "Right":
                            CmsDemo._currentObj.addClass("mode_box_tab3")
                            break;

                    }
                }
            });
            //--------------background
            $("#txtbgColor").val(CmsDemo._currentObj.css("background-color").replace("#", ""));
            var imgPath = CmsDemo._currentObj.css("background-image");
            if (imgPath != "" && imgPath.indexOf("url(") > -1)
                imgPath = imgPath.substring(4, imgPath.length - 1);
            $("#txtbgPath").val(imgPath);

            var tempPos;
            if (CmsDemo._currentObj.css("background-position"))
                tempPos = CmsDemo._currentObj.css("background-position").replace("px", "");
            if (tempPos)
            {
                $("#txtbgHorizontal").val(tempPos.split(" ")[0]);

                $("#txtbgVertical").val(tempPos.split(" ")[1]);
            }
            $("#bgrepeat").val(CmsDemo._currentObj.css("background-repeat"));


            //---------border  BS is short for border-style BC border-color BW border-width
            $("#txtBStop").attr("disabled", false).val(CmsDemo._currentObj.css("border-top-style"));

            $("#txtBSbottom").val(CmsDemo._currentObj.css("border-bottom-style"));

            $("#txtBSleft").val(CmsDemo._currentObj.css("border-left-style"));

            $("#txtBSright").val(CmsDemo._currentObj.css("border-right-style"));


            $("#txtBCtop").attr("disabled", false).val(CmsDemo._currentObj.css("border-top-color").replace("#", ""));

            $("#txtBCbottom").val(CmsDemo._currentObj.css("border-bottom-color").replace("#", ""));

            $("#txtBCleft").val(CmsDemo._currentObj.css("border-left-color").replace("#", ""));

            $("#txtBCright").val(CmsDemo._currentObj.css("border-right-color").replace("#", ""));

            $("#font-style").val(CmsDemo._currentObj.css("font-style"));

            $("#font-weight").val(CmsDemo._currentObj.css("font-weight"));

            $("#text-decoration").val(CmsDemo._currentObj.css("text-decoration"));

            $("#font-size").val(CmsDemo._currentObj.css("font-size").replace("px", ""));

            $("#txtColor").val(CmsDemo._currentObj.css("color").replace("#", ""));

            $("#txtLineheight").val(CmsDemo._currentObj.css("line-height").replace("px", ""));

            $("#text-align").val(CmsDemo._currentObj.css("text-align"));

            $("#txtWordSpacing").val(CmsDemo._currentObj.css("word-spacing").replace("px", ""));

            $("#txtLetterSpaceing").val(CmsDemo._currentObj.css("letter-spacing").replace("px", ""));

            $("#txtIndent").val(CmsDemo._currentObj.css("text-indent").replace("px", ""));

            //boxmodel

            $("#divBoxModel span[id!='offset']").each(function(i)
            {
                var sizecss = CmsDemo._currentObj.css(this.id);
                $(this).text(Math.round(parseFloat(sizecss.replace("px", ""))));
            });

            if (CmsDemo._currentObj.css("overflow") == 'hidden')
            {
                $("#rdbShow").attr("checked", true);
            }
            else
                $("#rdbHide").attr("checked", false);
        },
        setPlayer: function(style)
        {
            if (style)
                $("#playerstyle").attr("href", "/css/" + style + ".css");
        },
        loadData: function()
        {
            $("#modulecontent>div").each(function(i)
            {
                var tempID = this.id;
                $(this).appendTo($("#" + tempID.replace("box_body", "mode_box")));
            });
        },
        pageData: function()
        {
            /*/
            {
            layout:"",
            style:"",
            contentstyle:"",
            cols:[
            {
            modules:[
            {id:"",style:"",parentid:"",titlestyle:"",bodystyle:"",titles:[{},{}]}
            ]
            },
            {}
            ]

            }
            */
            var goacrossTitle = function(titleChildren)//遍历每个子标题titleChildren-子标题的集合 reString－返回json
            {
                var reString = "";
                for (var k = 0; k < titleChildren.length; k++)//遍历每个子标题
                {
                    var tempTitle = titleChildren.eq(k),
                    titlemode = "",
                    temptext = $.trim(tempTitle.text().replace('\n', '').replace('\r', '')),
                    tempclass = tempTitle.attr("class") || "",
                    tempstyle = tempTitle.attr("style") || "";
                    reString += "{mode:\"" + titlemode + "\",text:\"" + temptext + "\",titleclass:\"" + tempclass + "\",style:\"" + tempstyle + "\"},";
                }
                return reString.substr(0, reString.length - 1);
            };
            var goacrossModule = function(modules, pid)//遍历每个模块的方法modules－模块的集合 reString-返回相应的json
            {
                var reString = "";
                for (var j = 0; j < modules.length; j++)//遍历每个模块
                {
                    var tempObj = modules.eq(j), //
                    id = tempObj[0].id, //模块id
                    parentid = pid ? pid : "", //父模块id

                    style = tempObj.attr("style") || "",
                    titleObj = tempObj.children(".mode_title,.master_title"),
            titleChildren = titleObj.children("div"),
            titleStyle = titleObj.attr("style") || "",
            bodystyle = tempObj.children("div.masterbody").attr("style") || "",
                    titles = "[";
                    titles += goacrossTitle(titleChildren);
                    titles += "]";
                    reString += "{ \"id\": \"" + id + "\", \"parentid\": \"" + parentid + "\", \"style\": \"" + style + "\", \"titles\": " + titles + ",\"titlestyle\":\"" + titleStyle + "\",\"bodystyle\":\"" + bodystyle + "\" },";
                    if (id.indexOf("master_grp") == 0 && tempObj.children(".masterbody").children("[id^='mode_box']").length > 0)//遍历组模块
                    {
                        reString += goacrossModule(tempObj.children(".masterbody").children("[id^='mode_box']"), id) + ",";
                    }
                    if (id.indexOf("master_tab") == 0 && tempObj.children("[id^='mode_box']").length > 0)//遍历tab模块
                    {
                        reString += goacrossModule(tempObj.children("[id^='mode_box']"), id) + ",";
                    }
                }
                return reString.substr(0, reString.length - 1);
            };


            var cols = $("#content>div"); //每一列
            var laycols = "["; //
            for (var i = 0; i < cols.length; i++)//遍历每一列
            {
                laycols += "{modules:[";
                var oc = cols.eq(i).children("div"); //每个模块
                laycols += goacrossModule(oc);
                laycols += "]},";
            }
            laycols = laycols.substr(0, laycols.length - 1);
            laycols += "]";
            var data = "{\"version\":\"v1\", \"layout\": \"" + CmsDemo._layout + "\", \"contentstyle\":\"" + ($("#content").attr("style") || "") + "\", \"style\":\"" + CmsDemo._currentstyle + "\", \"cols\": " + laycols + " }";
            $.cookie("pagedata", data.substring(0, 2000), { "expires": 2 }); //页面模块的样式
            if (data.length > 2000)
                $.cookie("pagedata2", data.substring(2000, data.length), { "expires": 2 });
            else
                $.cookie("pagedata2", "", { "expires": 2 });
            return data;
        }
    },
    plugin: {
        initPlugin: function()
        {
        }
    },
    tools: {
        //字符串变为数组
        strToArr: function(s)
        {
            var str_arr = new Array();
            len = s.length;
            for (i = 0; i < len; i++)
            {
                str_arr[i] = s.substring(i, i + 1);
            }
            return str_arr;
        },
        isMatchColor: function(s)
        {//是否为正确的颜色值
            var pattern = /^[0-9a-fA-F]{6}$/;
            var reg = new RegExp(pattern);
            return reg.test(s);
        },
        isCover: function(obj1, obj2)//判断两个对象是否相交
        {
            try
            {
                var w1 = obj1.outerWidth(),
                w2 = obj2.outerWidth(),
                h1 = obj1.outerHeight(),
                h2 = obj2.outerHeight(),

                offset1 = obj1.offset(),
                left1 = offset1.left,
                top1 = offset1.top,

                offset2 = obj2.offset(),
                left2 = offset2.left,
                top2 = offset2.top;

                var midX1 = left1 + w1 / 2,
                            midX2 = left2 + w2 / 2,
                            midY1 = top1 + h1 / 2,
                            midY2 = top2 + h2 / 2;

                if (Math.abs(midX1 - midX2) < (w1 + w2) / 2 && Math.abs(midY1 - midY2) < (h1 + h2) / 2)//两个中点的横向距离小于两个宽度的一半，纵向距离小于两个高度的一半
                    return true;
                return false;
            } catch (e)
            {
                return false;
            }

        },
        isMaster: function(obj)//obj为jquery element
        {//判断该元素是否为母版模块
            var pattern = /^master_\w{2,3}_no\d+$/;
            var reg = new RegExp(pattern);
            return reg.test(obj.attr("id"));
        },
        _objLoad: null,
        showLoading: function()//显示loading
        {
            CmsDemo.tools._objLoad = $("#loading"), loadH = CmsDemo.tools._objLoad.outerHeight(), loadW = CmsDemo.tools._objLoad.outerWidth();
            CmsDemo.tools._objLoad.css({ left: ($(window).width() - loadW) / 2 + $(window).scrollLeft(), top: ($(window).height() - loadH) / 2 + $(window).scrollTop() }).show();
        },
        hideLoading: function()//隐藏loading
        {
            if (CmsDemo.tools._objLoad)
                CmsDemo.tools._objLoad.hide();
        },
        shake: function(obj)
        {
            if (typeof (obj) != 'object')
                return;
            var tempPos = obj.css("position");
            if (tempPos != 'absolute')
                obj.css("position", "relative");
            obj
    .animate({ left: -20 }, 100)
    .animate({ left: 20 }, 80)
    .animate({ left: -20 }, 60)
    .animate({ left: 20 }, 40)
    .animate({ left: -20 }, 20)
    .animate({ left: 20 }, 20)
    .animate({ left: 0, position: tempPos }, 10);
        },
        options: function(arr, css)
        {//包括选择项的数组，样式的数据{}
            var vhtml = "<dl>";
            for (var i = 0; i < arr.length; i++)
            {
                vhtml += "<dd>" + arr[i] + "</dd>";
            }
            vhtml += "</dl>";
            return $(vhtml).css(css);
        }
    },
    start:
    {
        onstart: function()
        {
            CmsDemo.plugin.initPlugin();
            CmsDemo.event();
            CmsDemo.module.event();
        },
        getInfo: function()
        {
            //var data = { "layout": "13", style: 'pinkstyle', "laycols": [{ "models": [{ "id": "model11", "style": "background-color:red", "title": "模块1" }, { "id": "model12", "style": "background-color:red", "title": "模块2"}] }, { "models": [{ "id": "model31", "style": "background-color:red", "title": "模块3" }, { "id": "model32", "style": "background-color:red", "title": "模块4"}]}] }   

            /*
            var data = $.cookie("pageinfo");
            var ctStyle = $.cookie("content");
            if (ctStyle)
            $("#content").attr("style", ctStyle);
            try
            {
            data = eval('(' + data + ')');
            } catch (e)
            {
            return;
            }
            if (data)
            {
            CmsDemo._currentstyle = data.style;
            CmsDemo._layout = data.layout;
            var st = CmsDemo._currentstyle;
            $("#style").attr("href", "/theme/" + st.substr(0, st.length - 5) + "/css/" + st + ".css");
            CmsDemo.handler.setLayout(CmsDemo._layout);
            $.each(data.laycols, function(i, n)
            {
            var vhtm = "";
            $.each(n.models, function(j, o)
            {
            if (o.id.indexOf("master") == 0)
            {
            vhtm += "<div id='" + o.id + "' style='" + o.style + "' class='mode_box master_box'><div class='master_title'><div class='title001'>" + o.title1 + "</div><div class='title002'>" + o.title2 + "</div></div><div></div></div>";

                        }
            else
            vhtm += "<div id='" + o.id + "' style='" + o.style + "' class='mode_box'><div class='mode_title' style='display:" + o.titledisplay + "'><div class='title001'>" + o.title1 + "</div><div class='title002'>" + o.title1 + "</div></div><div></div></div>";
            });
            $("#content>div:eq(" + i + ")").empty().append(vhtm);
            });
            }
           
            */
            var pagedata = $.cookie("pagedata");
            var pagedata2 = $.cookie("pagedata2");
            pagedata += pagedata2; //{ "version": "v1", "layout": "free", "style": "greenstyle", "cols": [{ modules: [{ "id": "mode_box1_1", "parentid": "", "style": "position: absolute; cursor: move; width: 317px; height: 137px; left: 0px; top: 0px;", "titles": [{ mode: '', text: 'title 01', style: '' }, { mode: '', text: 'title 01', style: ''}], "titlestyle": "display: block;" }, { "id": "mode_box1_2", "parentid": "", "style": "position: absolute; cursor: move; width: 317px; height: 320px; left: 319px; top: 0px;", "titles": [{ mode: '', text: 'title 02', style: '' }, { mode: '', text: 'title 02', style: ''}], "titlestyle": "display: block;" }, { "id": "mode_box1_3", "parentid": "", "style": "position: absolute; cursor: move; width: 317px; height: 433px; left: 440px; top: 77px;", "titles": [{ mode: '', text: 'title 03', style: '' }, { mode: '', text: 'title 03', style: ''}], "titlestyle": "display: block;" }, { "id": "mode_box1_4", "parentid": "", "style": "position: absolute; cursor: move; width: 317px; height: 215px; left: 0px; top: 136px;", "titles": [{ mode: '', text: 'title 04', style: '' }, { mode: '', text: 'title 04', style: ''}], "titlestyle": "display: block;" }, { "id": "mode_box1_5", "parentid": "", "style": "position: absolute; cursor: move; width: 317px; height: 256px; left: 317px; top: 319px;", "titles": [{ mode: '', text: 'title 05', style: '' }, { mode: '', text: 'title 05', style: ''}], "titlestyle": "display: block;" }, { "id": "mode_box1_6", "parentid": "", "style": "position: absolute; cursor: move; width: 317px; height: 219px; left: 0px; top: 353px;", "titles": [{ mode: '', text: 'title 06', style: '' }, { mode: '', text: 'title 06', style: ''}], "titlestyle": "display: block;" }, { "id": "mode_box1_7", "parentid": "", "style": "position: absolute; cursor: move; width: 317px; height: 303px; left: 219px; top: 155px;", "titles": [{ mode: '', text: 'title 07', style: '' }, { mode: '', text: 'title 07', style: ''}], "titlestyle": "display: block;" }, { "id": "mode_box1_8", "parentid": "", "style": "position: absolute; cursor: move; width: 317px; height: 221px; left: 630px; top: 176px;", "titles": [{ mode: '', text: 'title 08', style: '' }, { mode: '', text: 'title 08', style: ''}], "titlestyle": "display: block;" }, { "id": "mode_box1_9", "parentid": "", "style": "position: absolute; cursor: move; width: 317px; height: 100px; left: 628px; top: 326px;", "titles": [{ mode: '', text: 'title 09', style: '' }, { mode: '', text: 'title 09', style: ''}], "titlestyle": "display: block;" }, { "id": "master_tb_no1", "parentid": "", "style": "cursor: move; position: absolute; width: 317px; height: 100px; left: 53px; top: 28px;", "titles": [{ mode: '', text: 'master 1', style: '' }, { mode: '', text: '', style: ''}], "titlestyle": ""}]}] };
            if (pagedata)
            {
                pagedata = eval("(" + pagedata + ")");

                CmsDemo._currentstyle = pagedata.style;
                CmsDemo._layout = pagedata.layout;
                var st = CmsDemo._currentstyle;
                $("#style").attr("href", "/theme/" + st.substr(0, st.length - 5) + "/css/" + st + ".css");
                $("#content").attr("style", pagedata.contentstyle);
                CmsDemo.handler.setLayout(CmsDemo._layout);

                $.each(pagedata.cols, function(i, n)//cols
                {
                    var tempCol = $("#content>div:eq(" + i + ")").empty();

                    $.each(n.modules, function(j, o)//modules
                    {
                        var vhtm = "";
                        var id = o.id,
                    parentid = o.parentid,
                    style = o.style,
                    titlestyle = o.titlestyle,
                    titlecontent = "";
                        $.each(o.titles, function(k, m)//titles
                        {
                            var titlemode = m.mode,
                        titletext = m.text,
                        titlestyle = m.style,
                        titleclass = m.titleclass;
                            titlecontent += "<div class='" + titleclass + "'>" + titletext + "</div>";

                        });
                        if (o.id.indexOf("master_") == 0)//形成组模块
                        {
                            vhtm += "<div id='" + id + "' style='" + style + "' class='mode_box master_box'><div class='master_title' style='" + titlestyle + "'>" + titlecontent + "</div><div class='masterbody'></div></div>";
                        }
                        else
                        {
                            vhtm += "<div id='" + id + "' style='" + style + "' class='mode_box'><div class='mode_title' style='" + titlestyle + "'>" + titlecontent + "</div><div class='modebody'></div></div>";
                        }

                        if (parentid != "")
                        {
                            if (parentid.indexOf("master_grp") == 0)
                                $("#" + parentid).children(".masterbody").append(vhtm);
                            else if (parentid.indexOf("master_tab") == 0)
                            {
                                CmsDemo.module.addTab(parentid, 0, $(vhtm));
                            }

                        }
                        else
                            tempCol.append(vhtm);
                    });

                });
            }
            CmsDemo.handler.loadData(); //载入内容数据
        }
    }
}
//this is the newest js
//work should start from this one.  2009.6.22