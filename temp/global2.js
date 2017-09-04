$(function()
{
    CmsDemo.start.getInfo();
    CmsDemo.start.onstart();

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
    _currentstyle: "greenstyle",
    _layout: "13",
    _currentObj: null, //编辑单个模块的样式时，这个记录当前编辑模块的ID
    _titleSpan: null, //存放标题的span
    _prevSytle: null, //记录修改之前的样式，注意在对话框关闭时要设置为空
    _prevTitle: null, //记录修改之前的标题,注意在对话框关闭时要设置为空
    launch: function(layout)
    {
        CmsDemo.handler.setLayout(layout);
        CmsDemo._layout = layout;

        var items = $("#content>div .mode_box");
        if (layout == "free")//选择自由布局
        {
            var objparent = $("#content>div");
            var pleft = objparent.offset().left;
            var ptop = objparent.offset().top;
            objparent.mysort("destroy");
            items.mydrag({});
            items.myresize({ container: $('#content') });
            items.each(function(i)
            {
                var objtemp = items.eq(i),
                    w = objtemp.width(),
                     h = objtemp.height(),
                     l = objtemp.offset().left - pleft,
                     t = objtemp.offset().top - ptop;
                objtemp.css({ width: w, height: h }); //屏敝myresize的bug
                objtemp.css({ left: l, top: t });

            });
            items.contextMenu("contextMenu", {
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
                    }
                }
            });
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
                    var title = $.trim(oc.eq(j).children(".mode_title").children("span").text().replace('\n', '').replace('\r', ''));
                    laycols += "{ \"id\": \"" + id + "\", \"style\": \"" + style + "\", \"title\": \"" + title + "\" },";
                }
                laycols = laycols.substr(0, laycols.length - 1);
                laycols += "]},";

            }
            laycols = laycols.substr(0, laycols.length - 1);
            laycols += "]";
            var data = "{\"version\":\"v1\", \"layout\": \"" + CmsDemo._layout + "\", \"style\":\"" + CmsDemo._currentstyle + "\", \"laycols\": " + laycols + " }";
            $.cookie("pageinfo", data, { "expires": 2 });

            alert("保存成功！"); chl.slideUp();
            $("#content>div").mysort("destory");
            $(".btnedit").addClass("nodisplay");
            $("#content>div .mode_box").mydrag("destroy");
            $("#content>div .mode_box").myresize('destroy');
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
        addModule: function()
        {
            alert("!");
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
                        masterHtml = "<div id=\"master_lr_no" + i + "\" class=\"mode_box\"><div class=\"mode_title\"><span>master " + i + "</span></div><span onclick='CmsDemo.module.addModule(this)' class='btnaddmodule'></span></div>";
                        break;
                    case "tb":
                        masterHtml = "<div id=\"master_tb_no" + i + "\" class=\"mode_box\"><div class=\"mode_title\"><span>master " + i + "</span></div><span onclick='CmsDemo.module.addModule(this)' class='btnaddmodule'></span></div>";
                        break;
                    case "tab":
                        masterHtml = "<div id=\"master_tab_no" + i + "\" class=\"mode_box\"><div class=\"mode_title\"><span>master " + i + "</span></div><span onclick='CmsDemo.module.addModule(this)' class='btnaddmodule'></span></div>";
                        break;
                }
                $("#content>div:last").append(masterHtml);
                CmsDemo.launch(CmsDemo._layout);
                CmsDemo.module.hilight();
                return false;
            });
            //----------------------------------------

            //-------------- 模块样式管理

            //----------------------------

            //    ----------effects
            var singleModule = $("#singleModule"), t = setTimeout("", 1), isOver = true, smH = singleModule.height(), tagsH = $("#tags").outerHeight(); //操作区域

            /*singleModule.hover(function()
            {

                clearTimeout(t);
            singleModule.css('overflow', 'visible').animate({ height: smH }, 500);
            isOver = true;
            }, function()
            {
            if (isOver)
            {
            t = setTimeout(function()
            {
            singleModule.css('overflow', 'hidden').animate({ height: tagsH }, 500);
            }, 1500);
            }
            });*/
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
                var hilight = $("<div class='hilight' style='position:absolute;display:none;z-index:-1'></div>"), edit = $("<div class='btnedit' style='top:0;right:0;position:absolute;' onclick='CmsDemo.handler.showDialog(this)'></div>"),
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
                /*
                temp.hover(function()
                {
                hilight.show();

                }, function()
                {
                hilight.hide();
                });
                */
            });
            var objcontent = $("#content");
            if (objcontent.children(".btnedit").length == 0)
                objcontent.append("<span class='btnedit' style='position:absolute;border:solid 1px;display:block;right:0;bottom:0;top:100%' onclick='CmsDemo.handler.showDialog(this)'></span>");
        },
        implement: function()//-------------- implement
        {
            //var Obj = CmsDemo._currentObj; this one is very interesting!!!
            $("#txtTitleContent").blur(function()
            {
                var v = $.trim($(this).val());
                if (v)
                    CmsDemo._currentObj.children(".mode_title").children("span").text(v);
            });
            //title
            $("#rdbTitleShow,#rdbTitleHide").click(function()
            {
                if ($("#rdbTitleHide").attr("checked"))
                {
                    CmsDemo._currentObj.children(".mode_title").hide();
                }
                else
                {
                    CmsDemo._currentObj.children(".mode_title").show();
                }

            });
            //--------------background
            $("#txtbgColor").blur(function()
            {
                var v = $.trim($(this).val());
                if (v && CmsDemo.tools.isMatchColor(v))
                    CmsDemo._currentObj.css("background-color", '#' + v);
            });
            $("#txtbgPath").blur(function()
            {
                var v = $.trim($(this).val());
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
                if (v && CmsDemo.tools.isMatchColor(v))
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
                if (v && CmsDemo.tools.isMatchColor(v))
                {
                    CmsDemo._currentObj.css("border-bottom-color", '#' + v);
                }
            });
            $("#txtBCleft").blur(function()
            {
                var v = $.trim($(this).val());
                if (v && CmsDemo.tools.isMatchColor(v))
                {
                    CmsDemo._currentObj.css("border-left-color", '#' + v);
                }
            });
            $("#txtBCright").blur(function()
            {
                var v = $.trim($(this).val());
                if (v && CmsDemo.tools.isMatchColor(v))
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
        {//设置块的层的关系
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
            CmsDemo._titleSpan = CmsDemo._currentObj.children(".mode_title").children("span");
            CmsDemo._prevSytle = CmsDemo._currentObj.attr("style");
            CmsDemo._prevTitle = CmsDemo._titleSpan.text();

            if (styleOpts)
                CmsDemo._currentObj.css(styleOpts);

            if (title)
                CmsDemo._titleSpan.text(title); //.children(".btnedit").html(); 
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
            if(CmsDemo._currentObj.attr("id")!="content")
                CmsDemo._currentObj.find(".hilight").show();
            $("#singleModule input:text").val("");

            var titleObj = CmsDemo._currentObj.children(".mode_title");
            //绑定页面
            $("#txtTitleContent").val(titleObj.children("span").text())

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

            $("#txtbgPath").val(CmsDemo._currentObj.css("background-image"));

            var tempPos = CmsDemo._currentObj.css("background-position");
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
                $(this).text(sizecss.replace("px", ""));
            });

            if (CmsDemo._currentObj.css("overflow") == 'hidden')
            {
                $("#rdbShow").attr("checked", true);
            }
            else
                $("#rdbHide").attr("checked", false);
            $("#singleModule").show();
        },
        loadData:function(){
             $("#modulecontent>div").each(function(i){
                var tempID=this.id;
                $(this).appendTo($("#mode_box"+tempID.substring(tempID.length-3,tempID.length)));
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
        showLoading: function()
        {
            CmsDemo.tools._objLoad = $("#loading"), loadH = CmsDemo.tools._objLoad.outerHeight(), loadW = CmsDemo.tools._objLoad.outerWidth();
            CmsDemo.tools._objLoad.css({ left: ($(window).width() - loadW) / 2 + $(window).scrollLeft(), top: ($(window).height() - loadH) / 2 + $(window).scrollTop() }).show();
        },
        hideLoading: function()
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
                        vhtm += "<div id='" + o.id + "' style='" + o.style + "' class='mode_box'><div class='mode_title'><span>" + o.title + "</span></div><div></div></div>";
                    });
                    $("#content>div:eq(" + i + ")").empty().append(vhtm);
                });
                
                CmsDemo.handler.loadData();
            }
        }
    }

} 