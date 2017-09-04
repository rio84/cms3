/*-------------

-*---------- new global start from global2.js

-*----------------------------------------*/

$(function()
{
CmsDemo.start.getInfo();
CmsDemo.start.onstart();

});

var fn = function() { };

var CmsDemo = fn.prototype = {
    _currentData: "",
    _currentstyle: "greenstyle", //当前的样式
    _layout: "13", //当前的布局
    _currentObj: null, //编辑单个模块的样式时，这个记录当前编辑模块
    _titleSpan: null, //存放标题的span
    _prevSytle: null, //记录修改之前的样式，注意在对话框关闭时要设置为空
    _prevTitle: null, //记录修改之前的标题,注意在对话框关闭时要设置为空
    launch: function(layout)
    {
        if (layout)
        {
            CmsDemo.handler.setLayout(layout);
            CmsDemo._layout = layout;
        }
        else
        {
            layout = CmsDemo._layout;
        }
        var items = $("#content>div .mode_box");
        if (layout == "free")//选择自由布局
        {
            var objparent = $("#content>div"),
             pleft = objparent.offset().left,
            ptop = objparent.offset().top;
            objparent.mysort("destroy");
            items.mydrag({});
            items.myresize({ container: $('#content') });
            items.each(function(i)
            {
                var objtemp = $(this),
                    w = objtemp.width(),
                     h = objtemp.height(),
                     l = objtemp.offset().left - pleft - parseInt(objtemp.css("margin-left").replace("px", "")),
                     t = objtemp.offset().top - ptop - parseInt(objtemp.css("margin-top").replace("px", ""));
                objtemp.css({ width: w, height: h }); //屏敝myresize的bug
                objtemp.css({ left: l + "px", top: t + "px" });

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
                    },
                    'toBottom': function(t)
                    {
                        CmsDemo.handler.setLayer($(t), "bottom");
                    },
                    'toUpper': function(t)
                    {
                        CmsDemo.handler.setLayer($(t), "up");
                    },
                    'toLower': function(t)
                    {
                        CmsDemo.handler.setLayer($(t), "down");
                    },
                    'remove': function(t)
                    {
                        $(t).remove();
                        CmsDemo.launch();
                    },
                    'moveInto': function(t)
                    {
                        if (secondMenu)
                            secondMenu.hide();
                    }
                },
                onContextMenu: function()//A custom event function which runs before the context menu is displayed. If the function returns false the menu is not displayed. This allows you to attach the context menu to a large block element (or the entire document) and then filter on right click whether or not the context menu should be shown.
                {
                    if (CmsDemo._layout == 'free')
                    {
                        if (CmsDemo._currentObj.attr("id").indexOf("master_") == 0)//判断是否母版
                        {
                            moveInto.css({ height: "0", visibility: "hidden", padding: "0" });
                        }
                        else
                        {
                            moveInto.css({ height: "", padding: "", visibility: "visible" });
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
            $("#content>div .mode_box").mydrag("destroy");
            $("#content>div .mode_box").myresize('destroy');
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
        var stylebtn = $("#greenstyle,#bluestyle,#pinkstyle");
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
            $("#content .btnedit").show();
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
            var data = "{\"version\":\"v1\", \"layout\": \"" + CmsDemo._layout + "\", \"style\":\"" + CmsDemo._currentstyle + "\", \"laycols\": " + laycols + " }";
            $.cookie("pageinfo", data, { "expires": 2 }); //页面模块的样式
            $.cookie("content", $("#content").attr("style"), { "expires": 2 }); //内容的样式

            //$("#content div[id^='master_']")
            //{master_id:[{title:title,content_id:divid},{},{}]}
            //$.cookie();//母版的内容

            alert("保存成功！"); chl.slideUp();

            $("#content .btnedit").addClass("nodisplay");
            $("#content div[id^='master_'] .btnrecover").hide();
            $("#content>div .mode_box").mydrag("destroy");
            $("#content>div .mode_box").myresize('destroy');
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
        addTab: function(id, tabindex)//增加内容页 id为当前母版的id tabindex 代表第几位
        {
            var contentObj = CmsDemo._currentObj.children("[id^='box_body']"), //内容
            titleObj = $.trim(CmsDemo._currentObj.children(".mode_title,.master_title").children("div").text()),
            masterObj = $("#" + id),
             masterTitle = masterObj.children(".master_title"), //母版的标题
            contents = masterTitle.siblings("[id^='box_body']"); //tab母版下 内容的块

            if (id.indexOf("_tab") > 0)//tab 标签的模版
            {
                if (!titleObj)
                    titleObj = "tag";
                titleObj = "<a href='javascript:' style='position:relative' class='mastertabs'><span onclick='CmsDemo.module.recoverModule(this);return false;' class='btnrecover'></span>" + titleObj + "</a>";


                if (tabindex > 1)
                {
                    masterTitle.children("a").eq(tabindex - 2).after(titleObj);
                    contents.eq(tabindex - 2).after(contentObj);
                }
                else if (tabindex == 1)
                {
                    masterTitle.after(contentObj).prepend(titleObj);
                }
                var tabs = masterTitle.children("a");
                tabs.unbind("click").click(function()
                {
                    tabs.removeClass("mastertabs_clicked");
                    $(this).addClass("mastertabs_clicked");
                    masterTitle.siblings("[id^='box_body']").hide().eq(tabs.index(this)).show();
                });
                CmsDemo._currentObj.remove();
                if (tabindex > 1)
                {
                    tabs.eq(tabindex - 1).click();
                }
                else if (tabindex == 1)
                {
                    tabs.eq(0).click();
                }
            }
            else if (id.indexOf("_tb") > 0)//上下的模版
            {
                var btnRecover = "<div class='btnrecover' onclick='CmsDemo.module.recoverModule(this,1)'></div>";
                if (tabindex == 1)
                    masterObj.children(".mastertop").append(contentObj).append(btnRecover);
                else if (tabindex == 2)
                    masterObj.children(".masterbottom").append(contentObj).append(btnRecover);
                CmsDemo._currentObj.remove();
            }
            else if (id.indexOf("_lr") > 0)//左右的模版
            {
                var btnRecover = "<div class='btnrecover' onclick='CmsDemo.module.recoverModule(this,1)'></div>";
                if (tabindex == 1)
                    masterObj.children(".masterleft").append(contentObj).append(btnRecover);
                else if (tabindex == 2)
                    masterObj.children(".masterright").append(contentObj).append(btnRecover);
                CmsDemo._currentObj.remove();
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
                moveInto.css({ height: "", visibility: "visible" }).unbind("mouseover").mouseover(function(e)
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
        recoverModule: function(obj, type)//移出模块 type 代表母版类型,不填默认为tab页
        {
            if (typeof (obj) != 'object')
                return;
            if (type)
            {
                var contentObj = $(obj).siblings("[id^='box_body']"),
                areaObj = $(obj).parent().parent().parent();
                var htmObj = $("<div id='" + contentObj[0].id.replace("box_body", "mode_box") + "' style='min-width:100px;_height:100px;_width:100px;min-height:100px;position:absolute;' class='mode_box'><div class='mode_title'></div><div></div></div>");
                areaObj.append(htmObj);
                htmObj.children(".mode_title").after(contentObj);
                CmsDemo.launch();
                $(obj).remove();
            }
            else
            {
                var tabObj = $(obj).parent(),
            titleObj = tabObj.parent(),
            tabObjs = titleObj.children(),
            contentObjs = titleObj.siblings("[id^='box_body']"),
            contentObj = contentObjs.eq(tabObjs.index(tabObj[0]));
                areaObj = titleObj.parent().parent();
                $(obj).remove();
                var htmObj = $("<div id='" + contentObj[0].id.replace("box_body", "mode_box") + "' style='min-width:100px;_height:100px;_width:100px;min-height:100px;position:absolute;' class='mode_box'><div class='mode_title'><div>" + tabObj.text() + "</div></div><div></div></div>");
                areaObj.append(htmObj);
                htmObj.children(".mode_title").after(contentObj.show());
                tabObj.remove();
                CmsDemo.launch();
                tabObjs = titleObj.children("a");
                tabObjs.unbind("click").click(function()
                {
                    tabObjs.removeClass("mastertabs_clicked");
                    $(this).addClass("mastertabs_clicked");
                    titleObj.siblings("[id^='box_body']").hide().eq(tabObjs.index(this)).show();
                });
                if (tabObj.length > 0)
                    tabObj.eq(0).click();
            }
        },
        event: function()
        {
            CmsDemo.module.implement();
            //----------------------------------------

            //--------------模块管理

            //----------------------------
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
                CmsDemo._currentObj.find(".hilight").hide();
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
            $("#content>div .mode_box").each(function(i)
            {
                var temp = $(this);
                if (temp.css("position") != 'absolute')
                    temp.css("position", 'relative');
                if (temp.children(".hilight").length > 0)
                    return;
                var hilight = $("<div class='hilight' style='position:absolute;display:none;z-index:-1'></div>"), edit = $("<div class='btnedit' style='position:absolute;top:0;right:0;' onclick='CmsDemo.handler.showDialog(this)'></div>"),
                tempH = temp.outerHeight(),
                tempW = temp.outerWidth(),
                l = temp.css('border-left-width'),
                t = temp.css("border-top-width");

                hilight.css({ left: '-' + '3px',
                    top: '-' + '3px',
                    bottom: '-3px',
                    width: "100%",
                    height: "100%",
                    border: "solid 1px #123456",
                    padding: "2px"
                });

                temp.append(hilight[0]).append(edit);
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
            /*
            $("#txtBWtop").attr("disabled", false).blur(function()
            {
            var v = $.trim($(this).val());
            if (v)
            {
            if ($("#ckbborderwidth").attr("checked"))
            CmsDemo._currentObj.css("border-width", v + "px");
            else
            CmsDemo._currentObj.css("border-top-width", v + "px");
            }
            });
            $("#txtBWbottom").blur(function()
            {
            var v = $.trim($(this).val());
            if (v)
            {
            CmsDemo._currentObj.css("border-bottom-width", v + "px");
            }
            });
            $("#txtBWleft").blur(function()
            {
            var v = $.trim($(this).val());
            if (v)
            {
            CmsDemo._currentObj.css("border-left-width", v + "px");
            }
            });
            $("#txtBWright").blur(function()
            {
            var v = $.trim($(this).val());
            if (v)
            {
            CmsDemo._currentObj.css("border-right-width", v + "px");
            }
            });

            //margin and padding
            $("#txtMargintop").blur(function()
            {
            var v = $.trim($(this).val());
            if (v)
            {
            if ($("#ckbMargin").attr("checked"))
            CmsDemo._currentObj.css("margin", v + "px");
            else
            CmsDemo._currentObj.css("margin-top", v + "px");
            }
            });
            $("#txtMarginbottom").blur(function()
            {
            var v = $.trim($(this).val());
            if (v)
            {
            CmsDemo._currentObj.css("margin-bottom", v + "px");
            }
            });
            $("#txtMarginleft").blur(function()
            {
            var v = $.trim($(this).val());
            if (v)
            {
            CmsDemo._currentObj.css("margin-left", v + "px");
            }
            });
            $("#txtMarginright").blur(function()
            {
            var v = $.trim($(this).val());
            if (v)
            {
            CmsDemo._currentObj.css("margin-right", v + "px");
            }
            });

            $("#txtPaddingtop").blur(function()
            {
            var v = $.trim($(this).val());
            if (v)
            {
            if ($("#ckbPadding").attr("checked"))
            {
            CmsDemo._currentObj.css({
            "padding-top": v + "px",
            "padding-bottom": v + "px",
            "padding-left": v + "px",
            "padding-right": v + "px"
            });
            }
            else
            CmsDemo._currentObj.css("padding-top", v + "px");
            }
            });
            $("#txtPaddingbottom").blur(function()
            {
            var v = $.trim($(this).val());
            if (v)
            {
            CmsDemo._currentObj.css("padding-bottom", v + "px");
            }
            });
            $("#txtPaddingleft").blur(function()
            {
            var v = $.trim($(this).val());
            if (v)
            {
            CmsDemo._currentObj.css("padding-left", v + "px");
            }
            });
            $("#txtPaddingright").blur(function()
            {
            var v = $.trim($(this).val());
            if (v)
            {
            CmsDemo._currentObj.css("padding-right", v + "px");
            }
            });
            */
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
                return false;
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
        showDialog: function(id)
        {
            if (typeof (id) == 'string')
                CmsDemo._currentObj = $("#" + id);
            else
            {
                CmsDemo._currentObj = $(id).parent();
            }
            $("#content .hilight").hide();
            if (CmsDemo._currentObj.attr("id") != "content")
                CmsDemo._currentObj.find(".hilight").show();
            $("#singleModule input:text").val("");
            $(".icon_up").addClass("nodisplay");
            CmsDemo.handler.showSingleModultTab(0);
            CmsDemo.handler.setCss();
            $("#singleModule").show();
        },
        setCss: function()
        {
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
            /*

            $("#txtBWtop").attr("disabled", false).val(CmsDemo._currentObj.css("border-top-width"));

            $("#txtBWbottom").val(CmsDemo._currentObj.css("border-bottom-width"));

            $("#txtBWleft").val(CmsDemo._currentObj.css("border-left-width"));

            $("#txtBWright").val(CmsDemo._currentObj.css("border-right-width"));
            */

            //margin and padding
            /*
            $("#txtMargintop").val(CmsDemo._currentObj.css("margin-top"));

            $("#txtMarginbottom").val(CmsDemo._currentObj.css("margin-bottom"));

            $("#txtMarginleft").val(CmsDemo._currentObj.css("margin-left"));

            $("#txtMarginright").val(CmsDemo._currentObj.css("margin-right"));

            $("#txtPaddingtop").val(CmsDemo._currentObj.css("padding-top"));

            $("#txtPaddingbottom").val(CmsDemo._currentObj.css("padding-top"));

            $("#txtPaddingleft").val(CmsDemo._currentObj.css("padding-top"));

            $("#txtPaddingright").val(CmsDemo._currentObj.css("padding-top"));
            */
            //text
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
        loadData: function()
        {
            $("#modulecontent>div").each(function(i)
            {
                var tempID = this.id;
                $(this).appendTo($("#" + tempID.replace("box_body", "mode_box")));
            });
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
            CmsDemo.event();
            CmsDemo.module.event();
        },
        getInfo: function()
        {
            //var data = { "layout": "13", style: 'pinkstyle', "laycols": [{ "models": [{ "id": "model11", "style": "background-color:red", "title": "模块1" }, { "id": "model12", "style": "background-color:red", "title": "模块2"}] }, { "models": [{ "id": "model31", "style": "background-color:red", "title": "模块3" }, { "id": "model32", "style": "background-color:red", "title": "模块4"}]}] }
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
            CmsDemo.handler.loadData(); //载入内容数据
        }
    }
}

//this is the newest js
//work should start from this one.  2009.6.22

var Module = fn.prototype = {
    setStyle: function() { },

    moveInto: function() { },

    moveOut: function() { },

    showDialog: function() { }

}