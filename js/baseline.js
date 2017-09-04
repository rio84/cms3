//created by wu rui 2009-7-7
//this plugin is used for drag and resize DIVs
//when the DIV is dragged to a certain position, the baseline will appear to help locate

(function($)
{
    //a set of objects
    //options={trigger:'selector'}
    $.fn.baseline = function(options)
    {
        ///	<summary>
        ///	拖动的方法
        ///	</summary>
        ///	<param name="options" type="object">
        /// 用户选项
        ///	</param> 
        var oCurrentObj = $(this), //当前对象
        defaultopts = { trigger: null }, //默认选项
        aPos, //记录位置信息的数组
        fnRemove = function()
        {
            ///	<summary>
            ///	清除所有线的方法
            ///	</summary>
            $("hr").remove();
        },
        fnRecordPos = function()
        {
            ///	<summary>
            ///	记录位置的方法
            ///	</summary>
            aPos = new Array();
            oCurrentObj.each(function(i)
            {
                var vPos = { left: 0, right: 0, top: 0, bottom: 0 },
            oTemp = $(this);
                vPos.left = oTemp.offset().left;
                vPos.right = oTemp.outerWidth() + vPos.left;
                vPos.top = oTemp.offset().top;
                vPos.bottom = vPos.top + oTemp.outerHeight();
                aPos.push(vPos);
            });
        },
        fnCreatLine = function(top, left, size, type)//type:v-垂直方向/h－水平方向 size:长度/宽度
        {
            ///	<summary>
            ///	创建基准线的方法
            ///	</summary>
            ///	<param name="top" type="number">
            /// top
            ///	</param>
            ///	<param name="left" type="number">
            /// left
            ///	</param>
            ///	<param name="size" type="number">
            /// 长度/宽度
            ///	</param>
            ///	<param name="type" type="number">
            /// v-垂直方向/h－水平方向
            ///	</param>
            var oLine = $("<hr />");
            var 
                vColor = '#FF0000',
                vWidth = 0,
                vHeight = 0,
                vTop = top,
                vLeft = left;
            if (type == "v")
            {
                vHeight = size;
            }
            else if (type == "h")
            {
                vWidth = size;
            }
            oLine.css({
                'border-color': vColor,
                width: vWidth + 'px',
                height: vHeight + 'px',
                position: 'absolute',
                left: vLeft + 'px',
                top: vTop + 'px',
                margin: 0,
                padding: 0,
                'z-index': 100
            });
            $("body").append(oLine);
        },
        fnHandler = function(o)
        {
            ///	<summary>
            ///	传入一个对象 对此对象创造基准线
            ///	</summary>
            ///	<param name="o" type="object">
            /// 操作的对象
            ///	</param>
            if (!o) return;
            fnRemove();
            var iIndex = oCurrentObj.index(o);
            o = $(o);
            var vFlag = { left: o.offset().left,
                right: o.offset().left + o.outerWidth(),
                top: o.offset().top,
                bottom: o.offset().top + o.outerHeight()
            }; // aPos[iIndex];
            for (var i = 0; i < aPos.length; i++)
            {
                //循环遍历记录有位置信息的数组，对符合一定条件的产生基准线
                if (i != iIndex)
                {
                    var vTemp = aPos[i];
                    if (vTemp.left == vFlag.left)
                    {
                        var vl = vTemp.left, vt = vTemp.top < vFlag.top ? vTemp.top : vFlag.top, size = 0;
                        size = (vTemp.bottom > vFlag.bottom ? vTemp.bottom : vFlag.bottom) - (vTemp.top < vFlag.top ? vTemp.top : vFlag.top);
                        fnCreatLine(vt, vl, size, "v");
                    }
                    if (vTemp.right == vFlag.right)
                    {
                        var vl = vTemp.right, vt = vTemp.top < vFlag.top ? vTemp.top : vFlag.top, size = 0;
                        size = (vTemp.bottom > vFlag.bottom ? vTemp.bottom : vFlag.bottom) - (vTemp.top < vFlag.top ? vTemp.top : vFlag.top);
                        fnCreatLine(vt, vl, size, "v");
                    }
                    if (vTemp.top == vFlag.top)
                    {
                        var vl = vTemp.left < vFlag.left ? vTemp.left : vFlag.left, vt = vTemp.top, size = 0;
                        size = (vTemp.right > vFlag.right ? vTemp.right : vFlag.right) - (vTemp.left < vFlag.left ? vTemp.left : vFlag.left);
                        fnCreatLine(vt, vl, size, "h");

                    }
                    if (vTemp.bottom == vFlag.bottom)
                    {
                        var vl = vTemp.left < vFlag.left ? vTemp.left : vFlag.left, vt = vTemp.bottom, size = 0;
                        size = (vTemp.right > vFlag.right ? vTemp.right : vFlag.right) - (vTemp.left < vFlag.left ? vTemp.left : vFlag.left);
                        fnCreatLine(vt, vl, size, "h");
                    }
                }
            }
        };
        //begin run
        $.extend(defaultopts, options)
        fnRecordPos();
        var isBegin = false, //标识是否开始操作
        oHandlerObj = null, //handler
        trigger = defaultopts.trigger; //jquery选择器，选择能触发产生基准线的子元素
        oCurrentObj.bind("dragstart", function()
        {
            isBegin = true;
            oHandlerObj = this;
            fnHandler(this);
        });
        function fnBind()
        {
            ///	<summary>
            ///	触发开始事件
            ///	</summary>
            $(this).trigger("dragstart");
        };
        if (trigger)
        {
            ///	<summary>
            ///	能触发产生基准线的子元素绑定事件
            ///	</summary>
            oCurrentObj.find(trigger).bind("mousedown", fnBind);
        }
        oCurrentObj.bind("mousedown", fnBind);
        var _fnMousemove = function()
        {
            ///	<summary>
            ///	鼠标移动时执行的方法
            ///	</summary>
            if (isBegin)
            {
                fnHandler(oHandlerObj);
            }
        },
        _fnMouseup = function()
        {
            ///	<summary>
            ///	鼠标弹起时执行的方法
            ///	</summary>
            if (isBegin)
            {
                isBegin = false;
                fnRemove();
                fnRecordPos();
            }
        };
        $(document).bind("mousemove", _fnMousemove).bind("mouseup", _fnMouseup).bind("keypress", _fnMousemove);
    }

})(jQuery)