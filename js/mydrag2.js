(function($)
{
    //NOTICE:判断是否在容器内的方法需要重新定义
    $.fn.mydrag = function(opt)
    {
        var Objs = $(this),
        currentObj = null,
        containerObj = Objs.parent().eq(0),
        _currentPos = {
            left: 0,
            top: 0
        },
        _containerPos = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 },
         opts = { container: Objs.parent().eq(0), handler: Objs },
        _setPos = function(diffX, diffY)//设置当前移动块的位置
        {
            if (containerObj)
            {//现在父容器，计算方法还要进行扩展
                var currentW = currentObj.outerWidth(),
                currentH = currentObj.outerHeight(),
                currentOffset = currentObj.offset(),
                currentLeft = currentOffset.left,
                currentRight = currentObj.outerWidth() + currentLeft,
                currentTop = currentOffset.top,
                currentBottom = currentTop + currentObj.outerHeight();
                /*
                if ((currentLeft <= _containerPos.left && diffX < 0) || (currentRight >= _containerPos.right && diffX > 0))
                {
                diffX = 0;
                // currentObj.css({ top: diffY + _currentPos.top + 'px' });

                }
                if ((currentTop <= _containerPos.top && diffY < 0) || currentBottom >= _containerPos.bottom && diffY > 0)
                {
                diffY = 0;
                //currentObj.css({ left: _currentPos.left + diffX + 'px' });
                }*/


                var l = _currentPos.left + diffX, t = diffY + _currentPos.top;
                /*
                if (currentRight > _containerPos.right && diffX > 0)
                l = _containerPos.width - currentW;
                if (currentBottom > _containerPos.bottom && diffY > 0)
                t = _containerPos.height - currentH;*/

                if (l > _containerPos.width - currentW)
                    l = _containerPos.width - currentW;

                if (t > _containerPos.height - currentH)
                    t = _containerPos.height - currentH;
                currentObj.css({ left: l < 0 ? 0 : l + 'px', top: t < 0 ? 0 : t + 'px' });
            }
            else
            {
                if (currentObj)
                    currentObj.css({ left: _currentPos.left + diffX + 'px', top: diffY + _currentPos.top + 'px' });
            }

        };
        if (opt == "destroy")
        {
            if (Objs.length > 0)
                Objs.unbind("mousedown").removeClass("draghandler");
        }
        else
        {
            $.extend(opts, opt);
            var isdragStart = false, startX, startY;

            opts.handler.addClass("draghandler").css('cursor', 'move').mousedown(function(e)
            {
                containerObj = opts.container;

                currentObj = Objs.eq(opts.handler.index(this));
                _currentPos = {
                    left: currentObj.position().left,
                    top: currentObj.position().top
                }
                _containerPos.width = containerObj.innerWidth();
                _containerPos.height = containerObj.innerHeight();
                _containerPos.left = containerObj.offset().left;
                _containerPos.right = _containerPos.width + _containerPos.left;
                _containerPos.top = containerObj.offset().top;
                _containerPos.bottom = _containerPos.top + _containerPos.height;
                startX = e.clientX;
                startY = e.clientY;
                isdragStart = true;

                return false;
            });
        }
        $(document).mousemove(function(e)
        {
            if (isdragStart)
            {
                var moveX = e.clientX, moveY = e.clientY;
                _setPos(moveX - startX, moveY - startY);
                return false;
            }
        }).mouseup(function()
        {
            isdragStart = false;
        });


        return Objs;
    }

})(jQuery)