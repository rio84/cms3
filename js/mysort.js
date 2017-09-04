//------------------------->>>>>>>>>>>>>>>>>>>>>>> Test my own plugin
//wu rui's plugin. enlightened by jquery ui.sortable

//finish at 2009.6.4

//some places need repair are marked 'need repair'
$.fn.mysort = function(obj)
{
    ///	<summary>
    ///	排序的方法
    ///	</summary>
    ///	<param name="obj" type="object">
    /// 传入的参数：如obj={dragTitle:"title"}
    ///	</param> 
    var objCols = $(this),
        items = objCols.children(),
        helper = $("<div id='helper' style='width:120px;height:25px' class='helper'></div>"),
        holder = $("<div class='holder'></div>"),
        dropMethod = "a",   //表示在上面停放还是在下面 对应不同的操作 a-after b-before 或者in-append
        currentItem = null, //当前拖动的元素
        title = "",         //记录拖动时，显示该块的标题
        positionArr = null, //记录页面各块的位置信息
opts = { handler: items },
    itemsposition = function()
    {
        ///	<summary>
        ///	将所有块的位置信息记录在数组中
        ///	</summary>
        positionArr = new Array();
        items.each(function(i)//记录各块的位置
        {
            var temp = items.eq(i),
               wd = temp.width(),
               ht = temp.height(),
               lf = temp.offset().left,
               tp = temp.offset().top,
               eleinfo = { right: wd + lf, bottom: ht + tp, left: lf, top: tp };
            positionArr.push(eleinfo);
        });
        var areaHeight = objCols.parent().height();
        objCols.each(function(i)
        {
            var temp = objCols.eq(i);
            var wd = temp.width(),
               ht = areaHeight + 200, //temp.height() + 200, //加上200是为了能拖放到该区域
               lf = temp.offset().left,
               tp = temp.offset().top,
               eleinfo = { right: wd + lf, bottom: ht + tp, left: lf, top: tp };
            positionArr.push(eleinfo);    //存放列的位置,以支持空列的拖动
        });

    },
        overItem = function(pos)
        {
            ///	<summary>
            ///	判断拖动到哪个容器附近
            ///	</summary>
            ///	<param name="pos" type="object">
            /// 传入一组位置
            ///	</param> 
            for (var i = 0; i < positionArr.length; i++)
            {
                var temp = positionArr[i];
                var cuttop = 0; // $(window).scrollTop();
                var cutleft = 0; //$(window).scrollLeft();
                if (pos.left > (temp.left - cutleft) && pos.left < (temp.right - cutleft) && pos.top > (temp.top - cuttop) && pos.top < (temp.bottom - cuttop))
                {
                    if (i >= items.length)                                  //进入了块为空的列
                    {
                        dropMethod = "in";
                    }
                    else
                    {
                        if (pos.top > (temp.top + (temp.bottom - temp.top) / 2))//如果在块的下半部分
                        {
                            dropMethod = "a";
                        } else                                                  //在块的上半部分
                        {
                            dropMethod = "b";
                        }
                    }
                    return i;                                               //返回该元素在页面上的索引
                }
            }
            return -1;                                                      //如果没有符合，返回－1
        },
        createholder = function(wd, ht)                 //为holder设置高、宽
        {
            ///	<summary>
            ///	创建一个锁定当前位置的容器
            ///	</summary>
            ///	<param name="wd" type="number">
            /// 高度
            ///	</param>
            ///	<param name="ht" type="number">
            /// 宽度
            ///	</param> 
            holder.css({ width: wd + 'px', height: ht + 'px' });
        },
         refreshholder = function(i)                    //刷新holder的位置
         {
             ///<summary>
             ///动态更新一个锁定当前位置的容器
             ///</summary>
             ///<param name="i" type="int">
             /// 当前拖动到那个容器的索引
             ///</param>
             if (i != -1 && i != items.index(currentItem[0]))
             {
                 var temp;
                 if (i >= items.length)
                     temp = objCols.eq(i - items.length);
                 else
                     temp = items.eq(i);

                 createholder(temp.outerWidth() - 4, currentItem.outerHeight() - 4)//为holder设置高、宽
                 if (dropMethod == "a")              //如果拖到下半部，就after
                     temp.after(holder[0]);
                 else if (dropMethod == "b")         //如果拖到上半部，就before
                     temp.before(holder[0]);
                 else if (dropMethod == "in")        //如果拖到空列，就append
                     objCols.eq(i - items.length).append(holder[0]);

             }
         },
         createhelper = function(title)                 //创造helper
         {
             ///<summary>
             ///创建一个随鼠标一起移动的指示容器
             ///</summary>
             ///<param name="title" type="string">
             /// 用于显示的标题
             ///</param>
             if (title)
                 helper.text(title);
             helper.css({ position: "absolute", 'z-index': 1000000 });
             helper.appendTo("body");
         },
         refreshhelper = function(pos)                  //刷新helper
         {
             ///<summary>
             ///时刻更新这个随鼠标一起移动的指示容器的位置
             ///</summary>
             ///<param name="pos" type="object">
             /// 位置信息
             ///</param>
             helper.css({ left: pos.left, top: pos.top });
         },
           _dragStart = function(obj, tl)
           {
               ///<summary>
               ///拖动开始
               ///</summary>
               ///<param name="obj" type="object">
               /// 当前拖动的对象
               ///</param>
               ///<param name="tl" type="string">
               /// 标题
               ///</param>
               title = tl;                              //给title赋值
               currentItem = obj;                       //记录当前块
               if (!currentItem)
                   return;
               createhelper(title);                //创造helper
               currentItem.css({                        //改变当前块的样式
                   //display: 'none',
                   'filter': 'alpha(opacity=50)',
                   '-moz-opacity': '0.5',
                   'opacity': '0.5'
               });
           },

         _onDrag = function(pos)            //拖动中
         {
             ///<summary>
             ///拖动中
             ///</summary>
             ///<param name="pos" type="object">
             /// 位置信息 如pos={left:0,right:0,top:0,bottom:0}
             ///</param>
             refreshhelper(pos);            //刷新helper和holder的位置
             var i = overItem(pos)
             if (i != -1)
                 refreshholder(i);
         },

         _dragStop = function(pos)          //拖动结束
         {
             ///<summary>
             ///拖动结束
             ///</summary>
             ///<param name="pos" type="object">
             /// 位置信息 如pos={left:0,right:0,top:0,bottom:0}
             ///</param>
             var i = overItem(pos);         //当前停留的块的索引
             if (i != -1 && i != items.index(currentItem[0]))
             {
                 if (dropMethod == "a")
                     items.eq(i).after(currentItem[0]);
                 else if (dropMethod == "b")
                     items.eq(i).before(currentItem[0]);
                 else if (dropMethod == "in")
                     objCols.eq(i - items.length).append(currentItem[0]);
             }
             currentItem.css({
                 //display: 'block',
                 'filter': 'alpha(opacity=100)',
                 '-moz-opacity': '1',
                 'opacity': '1'
             });
             holder.remove();                   //移除helper和holder
             helper.remove();
             currentItem = null;
             positionArr = null;

         };

    ///注销该方法
    if (obj == "destroy")
    {
        var tempObj = objCols.find(".sorthandler");
        if (tempObj.length > 0)
            tempObj.unbind("mousedown").removeClass("sorthandler");
    }
    else
    {
        $.extend(opts, obj);
        var t = setTimeout("", 1), isBegin = false;
        opts.handler.addClass("sorthandler").unbind("mousedown").bind('mousedown', function(ed)
        {
            if (obj == "disable")
                return true;
            var temp = items.eq(opts.handler.index(this));
            var pausefun = function()
            {
                ///<summary>
                ///鼠标按下执行的方法
                ///经过一个时间段后才执行，以屏蔽快速点击
                ///</summary>
                isBegin = true;
                itemsposition();
                var dpos = { left: ed.clientX + $(window).scrollLeft(), top: ed.clientY + $(window).scrollTop() };
                _dragStart(temp, temp.children("div").children("span").eq(1).text()); //need repair
            }
            t = setTimeout(pausefun, 100); //the delay timespan is very important. if it equal to 300, there will be a bug if you drag quickly.
            return false;
        });
        var _fnMove = function(e)
        {
            ///<summary>
            ///拖动中执行的方法
            ///</summary>
            ///<param name="e" type="object">
            /// 鼠标对象
            ///</param>
            if (isBegin)
            {
                var pos = { left: e.clientX + $(window).scrollLeft(), top: e.clientY + $(window).scrollTop() };
                _onDrag(pos);
            }
        },
        _fnUp = function(eup)
        {
            ///<summary>
            ///鼠标弹起执行的方法
            ///</summary>
            ///<param name="eup" type="object">
            /// 鼠标对象
            ///</param>
            clearTimeout(t);
            if (isBegin)
            {
                isBegin = false;

                var pos = { left: eup.clientX + $(window).scrollLeft(), top: eup.clientY + $(window).scrollTop() };
                _dragStop(pos);
            }
        }
        $(document).bind("mousemove", _fnMove).bind("mouseup", _fnUp);
    }
    return objCols;
}
//----------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>