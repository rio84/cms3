//wu rui 2009.7.22

/*

1--
layout的形式 1_1_2, 2_1_1
theme的形式 greenstyle,redstyle

2--
操作区域按钮点击后的样式统一为“selected”


*/


var ModeType = {
    /*

定义一个对象，存放不同类型的模块，对应着抛出不同的html

mnormal/mtab/mgroup/mflash/mvideo/mphoto/mlogin

*/
    "normal": "<div class='fr_mnormal ui_mnormal'><div class='fr_mnormal_title ui_mnormal_title'></div><div class='fr_mnormal_body ui_mnormal_body'></div><div class='fr_mnormal_foot ui_mnormal_foot'></div></div>",
    "tab": "",
    "group": "",
    "flash": "",
    "video": "",
    "photo": "",
    "login": ""
}
$.pagemanager = function(obj)
{
    /// <summary>
    ///	进行页面管理的方法。
    ///	</summary>
    ///	<param name="obj" type="object">
    /// 各种选项
    ///	</param>

    var 
    defaultopts = {         //定义页面上各元素的选项器

        sHeadLinkTheme: "#style", //head部分，用于切换风格的链接

        //－－－－－－－－－－－－－－－－－页面各元素
        sLayout: "#layout",        //画布选择器
        sContentArea: "",   //内容区域选择器
        sFloatArea: "",     //浮动区域选择器
        sContent: "#content",       //内容选择器
        sCol: "#content>div",           //列选择器
        sMode: "[id^='mode_box']",          //模块选择器
        sMTitle: "",        //模块标题选择器
        sMSubTitle: "",
        sMBody: "",         //模块内容选择器
        sMFoot: "",         //模块脚选择器

        sMasterMode: "[id^='mode_box']", //母版模块选择器

        sLaunchBtn: "#aChangeLayout",         //触发开始编辑状态的按钮

        //－－－－－－－－－－－－－－－－－操作按钮

        sOperation: "#changeLayout",       //操作区域

        sCurrentOperate: "#singleModule"//单个对象编辑区

    },
    defaultOperationArea = {//操作区域的元素

        sSaveBtn: "#asave",           //保存按钮
        sCancelBtn: "#aclose",         //退出按钮
        sChangeLayoutBtns: "#divlayout a", //改变布局的按钮 id特征为 layout-1_1_2,layout-1_3等
        sChangeThemeBtns: "#divstyle a", //改变主题的按钮 其按钮的id为 redstyle,greenstyle等
        sLayoutBtnPerfix: "layout-", //布局按钮的前缀
        sAddMode: "#divmodules>a",        //添加模块的按钮
        sAddContentBtn: "#btnAddContent", //添加内容块的按钮
        sBtnSelectedClass: "selected", //按钮选择后的样式名称
        sTab: "#changeLayout dl dd", //切换的标签
        sContent: "#changeLayout>div>div"//标签对应的内容区
    },
    defaultCurrentOperateArea = {//当前对象操作区

        /*
    
    对象描述：
    
    当前对象操作区，分为tab标签块和内容块，点击tab标签，内容区显示相应的内容块。
    
    除此之外，还有退出按钮。
    
    具体操作对象包括：背景，边框，文本，盒模型，子元素*，插件
        
        子元素包括：标题，内容，脚，tab母版块的tab标签
    
    交互：选择当前对象后，当前对象即不可再被拖拽,点击内容可进行内容管理。
   
    在操作区内，选择模块内元素，当前对象即变为选择的元素。显示返回按钮，可返回到模块级别
    
    进行管理。
    
    */
        sTab: "#tags>a", //切换的标签
        sContent: "#tagscontent>div", //标签对应的内容区
        sBackground: "", //背景操作区
        sBorder: "", //边框操作区
        sText: "", //文本操作区
        sBoxModel: "#divBox", //盒模型
        sChildElements: "", //模块内元素操作区
        sContentFormat: "", //内容版式
        sAdvancedStyle: "", //高级样式
        sImgPlayer: "", //图片播放器
        sPlayer: "", //播放器
        sCssInput: "",        //设置css样式的输入框
        sChildElementsBtn: "#fsChildElements>div>a", //子元素的列表，动态生成的按钮
        sBackBtn: "#btnback", //返回上级按钮
        sCancelBtn: "#btnModuleCancel"//退出的按钮

    },
    globalSets = {//全局的设置
        sEditBtn: "",           //单个模块的编辑按钮
        sModeHtml: "<div class='mode_box'><div></div><div></div></div>", //模块的html
        sNodisplay: "nodisplay", //一个display:none的样式

        sLayoutSeparator: "_", //布局中间的分隔符 1_1_2 的分隔符为"_"

        //perfix 前缀
        sLayoutClassPerfix: "fr_content_", //切换布局时，content切换不同class，这些class的前缀
        sContentIDPerfix: "sl_content_",
        sModePerfix: "sl_m",
        sMTitlePerfix: "",
        sMBodyPerfix: "",
        sMFootPerfix: ""
    },
    globalArguments = {//全部的参数
        iModeMaxID: 0//记录模块的最大的ID
    },
    oCurrent = null, //当前编辑对象
Head = {//head对象

    oLinkTheme: $(defaultopts.sHeadLinkTheme)//用于切换风格的链接

},
    Layout = {//定义画布对象

        oSelf: $(defaultopts.sLayout),
        sCurrentTheme: "greenstyle"
    },
    Content = {//定义页面内容区对象 

        //notice:在多内容区的情况下，考虑情况要多一点

        oSelf: $(defaultopts.sContent),
        sCurrentLayout: "1", //当前的页面布局
        oCurrentContent: $(defaultopts.sContent).eq(0), //当前操作的内容区 默认为第一个
        fnRefresh: function()
        {
            Content.oSelf = $(defaultopts.sContent);
            Content.oCurrentContent = $(defaultopts.sContent).eq(0)
        },
        fnGetLayout: function(o)
        {
            ///<summary>
            ///获取 content 的布局
            ///</summary>
            var obj = Content.oCurrentContent;
            if (o)
            {
                obj = o;
            }
            $.each(obj.attr("class").split(" "), function(i, n)
            {
                if (n.indexOf(globalSets.sLayoutClassPerfix) == 0)
                {
                    Content.sCurrentLayout = n.replace(globalSets.sLayoutClassPerfix, "");
                    return
                }
            });
        },
        fnAddSign: function()
        {
            ///<summary>
            ///添加一个用于选择当前content的按钮
            ///</summary>
            Content.fnRefresh();
            Content.oSelf.each(function()
            {
                var oTemp = $(this),
                oSign = $("<div style='position:absolute;left:0;top:0;z-index:10;' class='contentsign'></div>");
                if (oTemp.css("position") != "absolute")
                {
                    oTemp.css("position", "relative"); //改变其position属性
                }
                if (oTemp.children(".contentsign").length == 0)
                {
                    oTemp.append(oSign.click(function()
                    {
                        Content.setCurrentContent($(this));
                    }));
                }
            });
        },
        setCurrentContent: function(o)
        {
            ///<summary>
            /// 选择了当前编辑的content
            ///</summary>
            ///<param name="o" type="object">
            /// 点击的按钮，其父节点为当前对象
            ///</param>

            Content.oCurrentContent = o.parent();
            $(".contentsign").show();
            o.hide(); //当前的content隐藏编辑按钮
            Content.fnGetLayout();
            Col.fnRefresh();
            launch();
        },
        fnAddContent: function()
        {
            ///<summary>
            /// 添加content(内容块)
            /// 默认新添加的内容块布局为 1
            ///</summary>
            var iMaxNum = 0;
            Content.oSelf.each(function()
            {
                var iTemp = parseInt(this.id.replace(globalSets.sContentIDPerfix, ""));
                if (iTemp > iMaxNum)
                    iMaxNum = iTemp;
            });
            iMaxNum++;
            var vNewContent = "<div id='" + globalSets.sContentIDPerfix + iMaxNum + "' class='" + globalSets.sLayoutClassPerfix + "1 ui_content'><div id='" + globalSets.sContentIDPerfix + iMaxNum + "_col_0' class='fr_col_0 ui_col'></div><div class='clear'></div></div>";
            Content.oCurrentContent.after(vNewContent);

            Content.fnAddSign();

        }

    },
    Col = {//定义列对象

        oSelf: $(defaultopts.sCol), //
        fnRefresh: function()//页面改变，重新选择当前content下的col
        {
            Col.oSelf = Content.oCurrentContent.children(defaultopts.sCol);
        }

    },
    Mode = {//定义模块对象

        oSelf: $(defaultopts.sMode), //选择模块自身
        oTitle: {//模块标题对象

            oSelf: $(defaultopts.sMTitle), //选择标题自身
            oSubTitle: $(defaultopts.sMSubTitle), //子标题
            fnAddSubTitle: function(o, type, text, href)
            {
                ///<summary>
                ///添加子标题
                ///</summary>
                ///<param name="o" type="object">
                /// 当前操作的标题
                ///</param>
                ///<param name="type" type="string">
                ///子标题类型 type="link" OR type="text" 分别表示链接和文本
                ///</param>
                ///<param name="text" type="string">
                ///子标题的文本
                ///</param>
                ///<param name="href" type="string">
                ///子标题的链接地址
                ///</param>
                if (o)
                {
                    var vHtml = "";
                    if (type == "link")
                    {
                        vHtml = "<div><a href='" + href + "'>" + text + "</a></div>";
                    }
                    else
                    {
                        vHtml = "<div>" + text + "</div>";
                    }
                    o.append(vHtml);
                }
            },
            fnDelSubTitle: function(o)
            {
                if (o)
                {
                    o.remove();
                }
            }
        },
        oBody: {//模块身体对象

            oSelf: $(defaultopts.sMBody)
        },
        oFoot: {//模块脚对象

            oSelf: $(defaultopts.sMFoot)
        },
        fnRefresh: function()
        {
            Col.fnRefresh();
            Mode.oSelf = Content.oCurrentContent.children(defaultopts.sCol).children(defaultopts.sMode);
            Mode.oMaster = Content.oCurrentContent.children(defaultopts.sCol).children(defaultopts.sMasterMode);
            Mode.oTitle.oSelf = Mode.oSelf.children(defaultopts.sMTitle);
            Mode.oTitle.oSubTitle = Mode.oTitle.oSelf.children(defaultopts.sMSubTitle)
            Mode.oBody.oSelf = Mode.oSelf.children(defaultopts.sMBody);
            Mode.oFoot.oSelf = Mode.oSelf.children(defaultopts.sMFoot);
        },
        regPlugin: function()
        {
            ///	<summary>
            /// 为模块注册插件
            /// 
            /// 
            ///
            ///	</summary>
            Mode.fnRefresh();
            if (Content.sCurrentLayout == "free")
            {

                var items = Mode.oSelf;
                Col.oSelf.mysort("destroy");
                items.mydrag({}); //注册拖动
                items.myresize({ container: Content.oSelf });
                items.each(function(i)//将模块位置信息写在style中
                {
                    if ($(this).css("position") != 'absolute')
                    {
                        var 
    objtemp = $(this),
    objparent = objtemp.offsetParent(),
    pleft = objparent.offset().left,
    ptop = objparent.offset().top,
    w = objtemp.width(),
    h = objtemp.height(),
    l = objtemp.offset().left - pleft - parseInt(objtemp.css("margin-left").replace("px", "")),
    t = objtemp.offset().top - ptop - parseInt(objtemp.css("margin-top").replace("px", ""));
                        objtemp.css({ width: w + "px", height: h + "px" }); //屏敝myresize的bug
                        objtemp.css({ left: l + "px", top: t + "px" });
                    }

                });
                items.css({ "position": "absolute" }); //设置位置为absolute
                items.baseline({ trigger: "[class^='myresize']" }); //基准线

            }
            else
            {
                Mode.oSelf.css({ position: "", left: "", right: "", top: "", bottom: "", width: "", height: "" });
                Mode.oSelf.mydrag("destroy");
                Mode.oSelf.myresize("destroy");
                Col.oSelf.mysort(); //为能进行样式管理的对象添加编辑按钮
            }
            Mode.editbtn();
        },
        editbtn: function()
        {
            ///	<summary>
            /// 为可单独管理样式的对象添加编辑按钮
            /// 
            /// 
            ///
            ///	</summary>
            Mode.oSelf.each(function(i)
            {
                var temp = $(this);
                if (temp.css("position") != 'absolute')
                    temp.css("position", 'relative');

                var edit = $("<div class='btnedit' style='position:absolute;top:0;right:0;'></div>");
                if (temp.children(".btnedit").length == 0)
                    temp.append(edit);
            });
            var objcontent = Content.oCurrentContent;
            if (objcontent.children(".btnedit").length == 0)
                objcontent.append("<span class='btnedit' style='position:absolute;border:solid 1px;display:block;right:0;bottom:0;top:100%'></span>");
            var fnBind = function() { CurrentOperate.fnShow(this) }; //避免重复注册事件
            $(".btnedit").bind("click", fnBind);
        },
        fnAddMode: function(type)
        {
            ///	<summary>
            /// 添加模块
            ///	</summary>
            ///	<param name="type" type="string">
            /// 添加模块的类型
            ///	</param>
            if (type)
            {
                globalArguments.iModeMaxID += 1;
                var oNewMode = $(globalSets.sModeHtml);
                oNewMode.attr("id", "mode_box" + globalArguments.iModeMaxID); //需要重新整合
                Content.oCurrentContent.children("div:last").append(oNewMode);
                Mode.regPlugin();
            }
        },
        fnMoveIntoMaster: function(masterid, tabindex)
        {
            ///	<summary>
            /// 移入母版模块
            ///	</summary>
            ///	<param name="masterid" type="string">
            /// 移入母版模块的id
            ///	</param>
            ///	<param name="tabindex" type="string">
            /// 添加到tab的第几位，如果是组模块，则为一串字符
            ///	</param>
            if (typeof (masterid) != "string")
                return
            var oMaster = $("#" + masterid);
            if (oCurrent && oMaster)
            {
                if (masterid.indexOf("tab") > 0)//生成tab页母版
                {
                    //tab页的tab标签不写在标题内边，而是内容区上方另辟一块区域放tab
                    var //有待完成！
                    oTabs = $(), //tab标签
                    oContents = $(), //对应的内容块
                    oNewTab = $(), //最近生成的tab
                    oNewContent = oCurrent; //最近生成的tab对应的内容块
                    if (tabindex == 1)
                    {
                        oTabs.parent().prepend(oNewTab);
                        oContents.parent().prepend(oNewContent);
                    }
                    else
                    {
                        oTabs.eq(tabindex - 2).after(oNewTab);
                        oContents.eq(tabindex - 2).after(oNewContent);
                    }
                }
                else if (masterid.indexOf("group") > 0)//生成组母版
                {
                    oMaster.children(defaultopts.sMBody).append(oCurrent.css({ top: 0, left: 0 }));
                }
            }
        },
        fnMoveOut: function(o)
        {
            ///	<summary>
            /// 移出母版模块
            ///	</summary>
            ///	<param name="o" type="object">
            /// 当前操作对象
            ///	</param>
            if (o)
            {
                var 
            oReceiveArea = Content.oCurrentContent.children("div:first"); //接受移出模块的区域
                oReceiveArea.append(o);
            }
        },
        oMaster: $(defaultopts.sMasterMode), //母版模块
        isMaster: function(id)
        {
            return (id.indexOf("tab") > 0) || (id.indexOf("group") > 0);
        }

    },
    Operation = {//定义操作区域元素对象（包括整个操作区域，区域内的各元素）

        oSelf: $(defaultopts.sOperation), //操作区域对象
        oTabs: $(defaultOperationArea.sTab), //标签切换
        oContent: $(defaultOperationArea.sContent), //对应于标签的内容块
        oLayoutBtn: $(defaultOperationArea.sChangeLayoutBtns), //布局的标签
        oThemeBtn: $(defaultOperationArea.sChangeThemeBtns), //风格的按钮
        oSaveBtn: $(defaultOperationArea.sSaveBtn), //保存按钮
        oCancelBtn: $(defaultOperationArea.sCancelBtn), //退出按钮
        oAddMode: $(defaultOperationArea.sAddMode), //添加按钮
        oAddContentBtn: $(defaultOperationArea.sAddContentBtn), //添加内容块的按钮
        fnReady: function()
        {
            ///	<summary>
            /// 为操作区内的元素注册事件，产生交互效果
            /// 1.标签选择切换效果
            /// 2.功能按钮选项效果，产生的交互
            /// 3.保存与退出按钮
            ///	</summary>

            ////1.标签选择切换效果
            Operation.oTabs.click(function()
            {
                Operation.oTabs.removeClass("now"); //为支持可扩展性 now这个类名应该改为selected
                $(this).addClass("now");
                Operation.oContent.addClass(globalSets.sNodisplay).eq(Operation.oTabs.index(this)).removeClass(globalSets.sNodisplay);
            });

            ////2.功能按钮选项效果，产生的交互

            //2.1 选择布局
            Operation.oLayoutBtn.click(function()
            {
                Operation.oLayoutBtn.removeClass(defaultOperationArea.sBtnSelectedClass);
                $(this).addClass(defaultOperationArea.sBtnSelectedClass);
                handle.setLayout(this.id.split("-")[1]);
                return false;

            });
            //2.2 切换风格（更换主题）
            Operation.oThemeBtn.click(function()
            {
                Operation.oThemeBtn.removeClass(defaultOperationArea.sBtnSelectedClass);
                $(this).addClass(defaultOperationArea.sBtnSelectedClass);

                var vTheme = this.id;
                handle.setTheme(vTheme);
                //载入不同的主题
                return false;
            });
            //2.3 添加模块
            Operation.oAddMode.click(function()
            {
                Mode.fnAddMode(this.id);
                return false;
            });
            //2.4 添加内容块
            Operation.oAddContentBtn.click(function()
            {
                Content.fnAddContent();
                return false;
            });
            //// 3.保存与退出按钮
            Operation.oSaveBtn.click(function()
            {
                alert("save");
                return false;
            });
            Operation.oCancelBtn.click(function()
            {
                Operation.oSelf.slideUp();
                return false;
            });
        }

    },
    CurrentOperate =
    {
        oSelf: $(defaultopts.sCurrentOperate), //自身
        oCssInput: $(defaultCurrentOperateArea.sCssInput), //样式的输入框

        oBackBtn: $(defaultCurrentOperateArea.sBackBtn), //返回上级按钮
        oCancelBtn: $(defaultCurrentOperateArea.sCancelBtn), //退出按钮
        oTabs: $(defaultCurrentOperateArea.sTab), //标签切换
        oContent: $(defaultCurrentOperateArea.sContent), //对应于标签的内容块
        oBoxModel: $(defaultCurrentOperateArea.sBoxModel), //盒模型
        oChildElements: $(defaultCurrentOperateArea.sChildElements), //子元素
        oChildElementsBtn: $(defaultCurrentOperateArea.sChildElementsBtn), //子元素的列表，按钮
        fnRefresh: function()
        {
            ///	<summary>
            /// 刷新选择
            ///	</summary>
            CurrentOperate.oChildElementsBtn = $(defaultCurrentOperateArea.sChildElementsBtn);
        },
        fnShow: function(o)
        {
            ///	<summary>
            /// 弹出单个对象操作区的方法
            /// 1.获取当前操作对象，绑定当前对象的值给操作区
            /// 2.
            ///
            ///	</summary>
            ///	<param name="o" type="object">
            /// 点击的编辑按钮，其父节点为当前操作对象.如果o为空，则当前对象已经赋值
            ///	</param>
            if (o)
                oCurrent = $(o).parent();
            getVal();
            CurrentOperate.oSelf.show();
            //test alert(oCurrent.attr("id"))
            //fnShiftFunc("style");
            CurrentOperate.oCancelBtn.one("click", function()
            {//点击退出按钮
                CurrentOperate.oSelf.hide();
                //fnShiftFunc("content");
            });

            //动态生成子元素选项
            //规则：子元素的title属性，为选项内容
            var vHtml = "",
            btnContainer = CurrentOperate.oChildElements.children("fieldset").children("div");

            getChildElements().each(function()
            {
                vHtml += "<a href='javascript:'>" + this.title + "</a>";
            });
            btnContainer.html(vHtml); //动态生成子元素列表

            CurrentOperate.fnRefresh();
            if (oCurrent.parent().attr("id").indexOf(globalSets.sModePerfix) == 0)
            {//如果此元素的父节点中有模块元素，则隐藏“返回”按钮
                CurrentOperate.oBackBtn.show();
            }
            else
                CurrentOperate.oBackBtn.hide();
        },
        fnShiftFunc: function(type)
        {
            ///	<summary>
            /// 转换管理功能
            /// 1.改变插件的注册与否
            /// 2.
            ///
            ///	</summary>
            ///	<param name="type" type="string">
            /// 要转换管理方式的类型 style-样式  content-内容
            ///	</param>
            switch (type)
            {
                case "style": //样式管理
                    Mode.oSelf.mydrag();
                    Mode.oSelf.myresize({ container: Content.oSelf });
                    break;
                case "content": //内容管理
                    Mode.oSelf.mydrag("disable"); //暂时只写自由模式下的功能
                    Mode.oSelf.myresize("disable");

                    break;
            }

        },
        InputEvent:
        {
            // 注册事件
            fnInput: function()
            {
                ///	<summary>
                /// 样式输入框
                ///	</summary>
                CurrentOperate.oSelf.find("input").blur(function()
                {
                    var v, attr;

                    if (this.id == "txtbgHorizontal" || this.id == "txtbgVertical")
                    {//-------------背景位置
                        var bgPosH = $.trim($("#txtbgHorizontal").val()),
                    bgPosV = $.trim($("#txtbgVertical").val());
                        if (bgPosH)
                            bgPosH += "px ";
                        else
                            bgPosH = "left ";
                        if (bgPosV)
                            bgPosV += "px";
                        else
                            bgPosV = "top";
                        attr = "background-position";
                        v = (bgPosH + bgPosV);
                    }
                    else if (this.id == "background-image")
                    {//背景图片
                        attr = this.id;
                        v = "url(" + $.trim($(this).val()) + ")";
                    }
                    else if (this.id == "rdbHide" || this.id == "rdbShow")
                    {//overflow
                        attr = "overflow";
                        if ($("#rdbHide").attr("checked"))
                        {
                            v = "hidden";
                        }
                        else
                        {
                            v = "visible";
                        }
                    }
                    else if (this.id == "rdHide" || this.id == "rdShow")
                    {//display
                        attr = "display";
                        if ($("#rdHide").attr("checked"))
                        {
                            v = "none";
                        }
                        else
                        {
                            v = "";
                        }
                    }
                    else
                    {
                        attr = this.id;
                        v = $.trim($(this).val());
                    }
                    setVal(v, attr);
                });
            },
            fnColorPicker: function()
            {

                ///	<summary>
                /// 用到拾色器的输入框
                ///	</summary>
                txtcolor = CurrentOperate.oSelf.find("input[name='txtColor']"), //选择颜色的文本框
            btncolor = $(".clickcolor"); //确认选择颜色的按钮
                btncolor.mousedown(function()//
                {
                    tempindex = btncolor.index(this); //记录当前点击的第几个按钮
                }).ColorPicker({//选择颜色的控件
                    onSubmit: function(hsb, hex, rgb, el)
                    {
                        txtcolor.eq(tempindex).val(hex).blur(); //对应的文本框显示相应的值
                        $(el).ColorPickerHide();
                    }
                });
            },
            fnOverflow: function()
            {
                ///	<summary>
                /// 多余文本隐藏或显示
                ///	</summary>
                CurrentOperate.oSelf.find("input[name='overflow'],input[name='display']").click(function()
                {
                    $(this).blur();
                });
            },
            fnModeBox: function()
            {
                ///	<summary>
                /// 盒模型
                ///	</summary>
                var hasinput = false, //某个span下面是否有输入框
                 cssname = null, //css的样式名
                 currentSpan = null, //当前点击的span
                 tempVal = null, //当前span的值
                 input = $("<input type=\"text\" style='display:none;' />"); //输入框

                input.click(function()
                {
                    //return false;
                }).blur(function()
                {
                    var v = $.trim($(this).val());
                    if (v)
                    {
                        oCurrent.css(cssname, v == 'auto' ? v : (v + 'px'));
                        tempVal = v;
                    }
                    CurrentOperate.oBoxModel.append($(this).hide());
                    currentSpan.html(tempVal).css('z-index', 0);
                    hasinput = false;
                    return false;
                });
                CurrentOperate.oBoxModel.find("span[id!='offset']").click(function()
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
            fnChildElements: function()
            {
                ///<summary>
                ///子元素的操作和返回
                ///</summary>

                //子元素列表点击事件
                CurrentOperate.oChildElementsBtn.live("click", function()
                {
                    var index = CurrentOperate.oChildElements.index(this);
                    oCurrent = getChildElements.eq(index);
                    CurrentOperate.fnShow();
                });
                //返回按钮的点击事件
                CurrentOperate.oBackBtn.click(function()
                {
                    oCurrent = oCurrent.parent(); //oCurrent赋值为当前对象的父对象
                    CurrentOperate.fnShow();

                });
            },
            fnReady: function()
            {
                CurrentOperate.InputEvent.fnInput();
                CurrentOperate.InputEvent.fnColorPicker();
                CurrentOperate.InputEvent.fnOverflow();
                CurrentOperate.InputEvent.fnModeBox();
                CurrentOperate.InputEvent.fnChildElements();
            }
        },
        fnReady: function()
        {
            ///	<summary>
            /// 为单一对象操作区内的元素注册事件，产生交互效果
            /// 1.标签选择切换效果
            /// 2.功能按钮选项效果，产生的交互
            /// 3.保存与退出按钮
            ///	</summary>

            if ($.browser.msie && $.browser.version == '6.0')
            {
                //根据浏览器不同，对操作区用不同的样式
                //让操作区悬浮于窗体上方
                CurrentOperate.oSelf.css({ position: 'absolute', left: '0' });
                $(window).scroll(function()
                {
                    CurrentOperate.oSelf.css({ top: $(window).scrollTop() });
                });
            }

            CurrentOperate.oTabs.each(function(i)
            {
                $(this).click(function()
                {//点击不同标签，产生标签效果，显示相应的内容
                    CurrentOperate.oTabs.removeClass("clicked");
                    $(this).addClass("clicked").blur();
                    CurrentOperate.oContent.addClass(globalSets.sNodisplay).eq(i).removeClass(globalSets.sNodisplay);
                });
            });
            CurrentOperate.InputEvent.fnReady();
        }

    },
getVal = function()
{
    ///	<summary>
    /// 获得操作对象各属性值
    ///	</summary>

    if (oCurrent)
    {
        var oInputs = CurrentOperate.oSelf.find("input[type='text']")
        oInputs.each(function()
        {
            if (this.id != "txtbgHorizontal" && this.id != "txtbgVertical")
            {
                var v = oCurrent.css(this.id);
                if (v != undefined)
                    $(this).val(v.toString().replace("px", "").replace("#", ""))
            }
        });

        var bg = oCurrent.css("background-position")
        if (bg)
        {
            bg = bg.split(" ");
            $("#txtbgHorizontal").val(bg.split()[0])
            $("#txtbgVertical").val(bg[1])
        }
        if (oCurrent.css("display") == "none")
        {
            $("#rdHide").attr("checked", true);
        }
        else
            $("#rdShow").attr("checked", true);

        if (oCurrent.css("overflow") == "hidden")
        {
            $("#rdbHide").attr("checked", true);
        }
        else
            $("#rdbShow").attr("checked", true);

        //boxmodel
        CurrentOperate.oBoxModel.find("span[id!='offset']").each(function(i)
        {
            var sizecss = oCurrent.css(this.id);
            $(this).text(Math.round(parseFloat(sizecss.replace("px", ""))));
        });

    }
},
    setVal = function(v, attr)
    {
        ///	<summary>
        ///设置操作对象各属性值
        ///	</summary>
        ///	<param name="v" type="string">
        /// 值
        ///	</param>
        ///	<param name="attr" type="string">
        /// 要设置的属性
        ///	</param>

        if (oCurrent)
        {
            var 
    sType = tools.switchCss(v);
            switch (sType)
            {
                case "color":
                    v = "#" + v;
                    break;
                case "size":
                    v += "px";
                default:
                    break;
            }
            oCurrent.css(attr, v)
        }

    },
    getChildElements = function(o)
    {
        ///	<summary>
        ///	获得子元素的方法
        /// 此法适用于模块级别及以下元素
        /// 原理根据命名规则，模块下元素的id以模块元素的id开头再加后缀
        ///	</summary>
        ///	<param name="o" type="object">
        /// jquery element
        ///	</param>
        if (o)
            oCurrent = o;

        return oCurrent.children("id^='" + oCurrent[0].id + "'");

    },
    handle = {//实施功能
        setLayout: function(layout)
        {
            ///	<summary>
            ///	设置页面的布局方式
            ///	</summary>
            ///	<param name="layout" type="string">
            /// 例如：1_3，1_1_2，1_2_1等
            ///	</param>
            if (Content.sCurrentLayout == layout)//当前传入的layout为当前布局，就不执行下面代码
                return;

            var oContent = Content.oCurrentContent;
            oContent.removeClass(globalSets.sLayoutClassPerfix + Content.sCurrentLayout).addClass(globalSets.sLayoutClassPerfix + layout);
            var oCol = oContent.children(defaultopts.sCol); //选择列

            var newlen = layout.split(globalSets.sLayoutSeparator).length; //新布局的列数
            if (layout == "free")
            {
                newlen = 1;
            }
            var len = oCol.length; //容器当前列数
            //改变前后列数不一致，动态改变列的数量
            if (len > newlen)
            {
                var vhtm = "";
                for (var i = len - 1; i >= newlen; i--)
                {
                    var objlast = oCol.eq(i)
                    vhtm += objlast.html();
                    objlast.remove();
                }
                oCol.eq(newlen - 1).append(vhtm);
            }
            else if (len < newlen)
            {
                var vhtm = "";
                for (var i = len; i < newlen; i++)
                {
                    vhtm += "<div class=\"ui_col fr_col_" + (i).toString() + "\"></div>";
                }
                oCol.eq(len - 1).after(vhtm);
            }
            Content.sCurrentLayout = layout;
            Mode.regPlugin();
        },
        setTheme: function(vTheme)
        {
            ///	<summary>
            ///	设置页面的主题
            ///	</summary>
            ///	<param name="vTheme" type="string">
            ///
            ///	</param>
            Head.oLinkTheme.attr("href", "/theme/" + vTheme.substr(0, vTheme.length - 5) + "/css/" + vTheme + ".css");
            Layout.sCurrentTheme = vTheme;
        }
    },
    contextMenu =
    {//右键菜单对象
        isDisplayLeft: false, //菜单是否在左边显示
        FirstMenu: {
            oSelf: $("<div class='contextMenu'><ul><li id='remove'>移除</li><li id='top'>移动要顶层</li><li id='up'>上移一层</li><li id='down'>下移一层</li><li id='bottom'>移动要底层</li><li id='moveInto'>移入母版</li><li id='moveOut'>移出母版</li></ul></div>"),
            fnSet: function()
            {
                ///	<summary>
                ///	生成第一级菜单
                ///	</summary>
                ///	<returns type="object">
                /// 第一级菜单
                /// </returns>
                var oFirstMenu = contextMenu.FirstMenu.oSelf;

                oFirstMenu.css({//菜单的某些样式
                    "line-height": "20px",
                    position: "absolute",
                    "z-index": 50
                }).children("ul").children("li").css({
                    cursor: "pointer"
                }).hover(function()
                {//li的鼠标效果
                    $(this).css({ "background": "#c0c0c0" });
                    if (this.id == "moveInto")
                    {
                        var vleft = contextMenu.isDisplayLeft ? ($(this).offset().left - $(this).outerWidth()) : ($(this).offset().left + $(this).outerWidth()),
                    vtop = $(this).offset().top;
                        contextMenu.SecondMenu.fnShow(vleft, vtop);
                    }
                    else
                    {
                        contextMenu.SecondMenu.fnHide();
                    }
                }, function()
                {
                    $(this).css({ "background": "" });
                }).click(function()
                {
                    switch (this.id)
                    {
                        case "remove":
                            oCurrent.remove();
                            oCurrent = null;
                            Mode.fnRefresh();
                            break;
                        case "top":
                            oCurrent.parent().append(oCurrent);
                            break;
                        case "bottom":
                            oCurrent.parent().prepend(oCurrent);
                            break;
                        case "moveInto":
                            break;
                        case "moveOut":
                            break;
                        default:
                            tools.setLayer(oCurrent, this.id);
                            break;
                    }
                });
                return oFirstMenu.appendTo("body");
            },
            fnShow: function(l, t)
            {
                var oTemp = contextMenu.FirstMenu.fnSet();
                //以下进行判断，三个菜单宽度相加(前提是三个菜单宽度相等)超过窗体的宽度就在左边显示，否则在右边
                if (l + oTemp.outerWidth() * 3 > $(window).width())
                {
                    contextMenu.isDisplayLeft = true; //左边显示
                }
                else
                    contextMenu.isDisplayLeft = false; //右边显示

                oTemp.css({
                    top: t + "px",
                    left: l + "px"
                }).show();
            },
            fnHide: function()
            {
                if (contextMenu.FirstMenu.oSelf)
                    contextMenu.FirstMenu.oSelf.hide();
            }
        },
        SecondMenu: {
            oSelf: null,
            fnSet: function()
            {
                ///	<summary>
                ///	动态生成第二级菜单,步骤：鼠标划过“移入母版”-->显示母版选项及母版标识
                ///	</summary>
                ///	<returns type="object">
                /// 第二级菜单
                /// </returns>
                $("#secondMenu").remove();
                contextMenu.SecondMenu.oSelf = $("<div id='secondMenu' class='contextMenu'><ul></ul></div>");
                Mode.oMaster.each(function()
                {
                    var oTemp = $(this),
                sign = this.id.split("_")[2];
                    if (oTemp.children("[name='sign']").length == 0)//添加标识
                        oTemp.append("<div name='sign' style='text-align:center;position:absolute;height:22px;width:50px;background:#000000;top:0;right:0;display:none;color:#00ffff;font-size:20px;font-weight:700;z-index:3;'>" + sign + "</div>");

                    var oLi = $("<li>" + sign + "</li>");
                    var vMasterid = this.id;
                    oLi.hover(function()//选项鼠标划过的事件
                    {
                        $(this).css({ "background": "#c0c0c0" }); //背景颜色改变
                        var vleft = contextMenu.isDisplayLeft ? ($(this).offset().left - $(this).outerWidth()) : ($(this).offset().left + $(this).outerWidth()),
                    vtop = $(this).offset().top;
                        contextMenu.ThirdMenu.fnShow(vMasterid, vleft, vtop); //展现第三级菜单

                    }, function()
                    {
                        $(this).css({ "background": "" });
                    });
                    contextMenu.SecondMenu.oSelf.children("ul").append(oLi);
                });
                return contextMenu.SecondMenu.oSelf.css({
                    position: "absolute"
                }).appendTo("body");
            },
            fnShow: function(l, t)
            {
                ///	<summary>
                ///	显示第二级菜单
                ///	</summary>
                ///	<param name="t" type="number">
                ///  css 样式 top值
                ///	</param>
                ///	<param name="l" type="number">
                ///  css 样式 left值
                ///	</param>
                contextMenu.SecondMenu.fnSet().css({
                    left: l + "px",
                    top: t + "px"
                }).show();
                $("div[name='sign']").show();
            },
            fnHide: function()
            {
                if (contextMenu.SecondMenu.oSelf)
                {
                    contextMenu.SecondMenu.oSelf.hide();
                    contextMenu.ThirdMenu.oSelf.hide();
                    $("div[name='sign']").hide();
                }
            }
        },
        ThirdMenu: {//动态生成第三级菜单，显示为新加html,隐藏为remove
            oSelf: null,
            fnSet: function(masterid)
            {
                ///	<summary>
                ///	第三级菜单的基本设置 
                ///	动态生成右键第三级菜单
                ///	</summary>
                ///	<param name="masterid" type="String">
                /// 母模块的id
                ///	</param>
                $("#thirdMenu").remove(); //去除以前生成的第三级菜单
                contextMenu.ThirdMenu.oSelf = $("<div id='thirdMenu' class='contextMenu'><ul></ul></div>");
                var oMaster = $("#" + masterid), //第三级菜单要展现的母版对象
                oList = contextMenu.ThirdMenu.oSelf.children("ul");
                //第三级菜单的html字符串
                // vhtm = "<div id='thirdMenu' style='width:100px;position:absolute;z-index:10;display:none;'><ul style='border: 1px solid #888888; margin: 0px; padding: 1px; list-style-type: none; list-style-image: none; list-style-position: outside; background-color: #ffffff; width: 100px;'>";
                if (masterid.indexOf("tab") > 0)//如果是有tab页的模版
                {
                    var tabs = oMaster.find(".tab"); //所有标签的集合
                    tabs.each(function(i)
                    {
                        i++;
                        oList.append($("<li>第" + i + "位</li>"))
                    });
                    var temp = tabs.length + 1;
                    $("<li>第" + temp + "位</li>").appendTo(); //生成最后一位的选项
                }
                else if (masterid.indexOf("box") > 0)//如果是组模版
                {
                    oList.append($("<li>点击添加到组</li>"));
                }
                oList.children("li").click(function()
                {
                    //点击，移入
                    Mode.fnMoveIntoMaster(masterid, $.trim($(this).text()));
                });
                //为第三级菜单的选项添加鼠标效果
                contextMenu.ThirdMenu.oSelf.children("ul").children("li").css({
                    "padding": "3px",
                    "border": "1px solid #FFFFFF",
                    cursor: "pointer"
                }).hover(function()
                {
                    $(this).css({ background: "#B6BDD2", "border-color": "#0A246A" });
                }, function()
                {
                    $(this).css({ background: "#FFFFFF", "border-color": "#FFFFFF" });
                });

                return contextMenu.ThirdMenu.oSelf.appendTo("body");

            },
            fnShow: function(masterid, l, t)
            {
                //alert(masterid);

                //调整位置并显示
                contextMenu.ThirdMenu.fnSet(masterid).css({
                    left: l + "px",
                    top: t + "px",
                    position: "absolute"
                }).show();

            },
            fnHide: function()
            {
                if (contextMenu.ThirdMenu.oSelf)
                    contextMenu.ThirdMenu.oSelf.remove();
            }
        },
        fnHideAll: function()
        {
            contextMenu.FirstMenu.fnHide();
            contextMenu.SecondMenu.fnHide();
            contextMenu.ThirdMenu.fnHide();
        },
        fnReady: function()
        {
            //为模块绑定右键菜单
            Mode.oSelf.bind("contextmenu", function(e)
            {
                oCurrent = $(this);
                var vleft = e.clientX + $(window).scrollLeft(),
                    vtop = e.clientY + $(window).scrollTop()
                contextMenu.FirstMenu.fnShow(vleft, vtop)

                $(document).one("click", function()
                {//点击关闭菜单
                    contextMenu.fnHideAll();
                });
                return false;
            });
        }
    },
    ContentManager = function(o)
    {
        ///	<summary>
        ///	内容管理
        /// step 1.提取对象中的html，记录
        /// step 2.在一个区域显示一个输入框，并将上一步记录的html写入其中
        /// step 3.blur事件，移除html，将编辑后的html写到相应的区域中
        /// step 4.返回当前对象
        ///	</summary>
        ///	<param name="o" type="object">
        /// jquery element
        ///	</param>
        ///	<returns type="object">
        /// jquery element
        ///	</returns>
        if (o)
        {
            var 
            vHtml = o.html(),
            vHeight = o.height(),
            vWidth = o.width(),
            oTextarea =
            $("<textarea id='ContentInput'></textarea>").height(vHeight).width(vWidth).blur(function()
            {
                o.html($(this).val().replace("\r", "").replace("\n", ""));
            }).click(function() { return false; });
            o.empty().append(oTextarea.val(vHtml));
            oTextarea.focus();
            return o;
        }
    },
    launch = function()
    {
        ///	<summary>
        ///	设置页面使页面处于编辑状态
        /// step 1.操作区某些功能按钮处于选中状态
        /// step 2.根据页面布局为模块注册插件
        /// step 3.自由模式下，生成右键菜单
        /// step 4.操作区展开
        ///	</summary>
        ///	<param name="" type="string">
        ///
        ///	</param>

        //-------step 1

        //布局按钮处于选中状态
        Operation.oLayoutBtn.removeClass(defaultOperationArea.sBtnSelectedClass);
        $("#" + defaultOperationArea.sLayoutBtnPerfix + Content.sCurrentLayout).addClass(defaultOperationArea.sBtnSelectedClass);
        //主题按钮处于选中状态
        $("#" + Layout.sCurrentTheme).addClass(defaultOperationArea.sBtnSelectedClass);


        //为模块注册插件
        Mode.regPlugin();

        //右键菜单准备
        contextMenu.fnReady();
        //操作区展开
        Operation.oSelf.slideDown();



    },
    plugins = {

        fnRegSelect: function()
        {
            ///	<summary>
            ///	输入框模仿的select控件
            ///	</summary>
            /// 文本框name属性为‘opt’或 ‘borderopt’
            /// 选项的id为文本框的id+"opts"
            ///
            /////--------------my select
            //自己模仿的select控件
            var opt = null, //选项
            bg, objtxt = null,
            optcontainer = CurrentOperate.oSelf.find(".opt"),
            selects = CurrentOperate.oSelf.find("input:[name='opt'],input:[name='borderopt']");
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
            //－－－－－－－－－－－myselect end


        },
        fnReady: function()
        {
            plugins.fnRegSelect();
        }

    },
    start = function()
    {
        $.extend(defaultopts, obj);
        //内容区添加编辑按钮
        Content.fnAddSign();

        $(defaultopts.sLaunchBtn).click(function()
        { //点击使页面处于编辑状态
            // launch();
        });

        //操作区的事件
        Operation.fnReady();

        CurrentOperate.fnReady();

        //插件准备
        plugins.fnReady();

        alert("Ready!!!");
    };
    //begin run

    start();
}

var fn = function() { };
var tools = {
    isCover: function(obj1, obj2)//
    {
        ///	<summary>
        ///		判断两个对象是否相交
        ///	</summary>
        ///	<param name="obj1" type="object">
        /// jquery element
        ///	</param>
        ///	<param name="obj2" type="object">
        ///	jquery element
        ///	</param>
        ///	<returns type="boolean">
        /// true OR false
        /// </returns>
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
    setLayer: function(obj, oper)
    {
        ///	<summary>
        ///	设置层的上下关系
        ///	</summary>
        ///	<param name="obj" type="object">
        /// jquery element 当前操作对象
        ///	</param>
        ///	<param name="oper" type="string">
        ///	operations.such as 'up','down' et
        ///	</param>
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
                        if (tools.isCover(objSiblings.eq(i), obj))
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
                        if (tools.isCover(objSiblings.eq(i), obj))
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
    switchCss: function(s)
    {
        ///	<summary>
        ///	判断样式是什么单位
        ///	</summary>
        ///	<param name="s" type="string">
        /// 字符串
        ///	</param>
        ///	<returns type="string">
        /// 返回这个样式属于什么类型
        /// </returns>
        var color = /^[0-9a-fA-F]{6}$/, //匹配十六进制的颜色值
        size = /^\d+$/, //匹配尺寸数字
        string = /^\w+$/; // 匹配字符串
        var regcolor = new RegExp(color),
        regsize = new RegExp(size),
        regstring = new RegExp(string);
        if (regcolor.test(s))
        {
            return "color";
        }
        else if (regsize.test(s))
        {
            return "size";
        }
        else if (regstring.test(s))
        {
            return "string";
        }
        return;
    }
}
function temp()
{

}
var Operation = fn.prototype = {

}