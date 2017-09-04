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