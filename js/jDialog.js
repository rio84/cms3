/*------------------------
* jDialog  jQuery Plug-in

* © wu rui  2009-4-29

* USAGE: $("#myDiv").jDialog();

* NOTICE: to use this plugin, you should also import THESE: EasyDrag.js OR mydrag.js, jDialog-Style ---- this is a file including jDialog.css and some images.
 
* NOTICE: RETURN object is the child of jdialog content

-* ----------------------*/
/// <reference path="jquery.js" />

(function($)
{
    var o = null, op = null, b = null, d = null, callback = function() { };
    $.fn.jDialog = function(opt)
    {
        //-------------------  jDialog style  ----------------------//
        var opts = { blocker: true, width: "400px", height: "180px", background: '#fff', border: "3px solid #BFD1EE", title: 'JDialog', closecallback: function() { } };
        $.extend(opts, opt);
        callback = opts.closecallback;
        if (opts.blocker)
        {
            if ($.browser.msie && $.browser.version == '6.0')
            {
                $("body").append("<div id='jblocker'><iframe style='position:absolute;left:0;top:0;width:100%;height:100%;border:none;filter:alpha(opacity=0)'/></div>");
            }
            else
            {
                $("body").append("<div id='jblocker'></div><dl id='jDialog'><dt class='jd-title'><span class='jdleft'></span><span class='jdright'></span><a href='javascript://' class='jdclose'></a>" + opts.title + "</dt><dd></dd></dl>");
            }
            b = $("#jblocker");
        }
        $("body").append("<dl id='jDialog'><dt class='jd-title'><span class='jdleft'></span><span class='jdright'></span><a href='javascript://' class='jdclose'></a>" + opts.title + "</dt><dd>&nbsp;</dd></dl>")
        d = $("#jDialog");
        var tl = $("#jDialog dt");
        var dd = d.children("dd");
        o = $(this);
        op = o.parent();
        var w, h, t, l;
        d.css({//dialog container
            background: opts.background,
            border: opts.border,
            margin: 0,
            padding: 0,
            position: 'absolute',
            width: opts.width,
            overflow: 'visible',
            'z-index': '10000'
        });
        dd.css({//dialog content
            height: opts.height,
            'overflow': 'hidden',
            width: opts.width
        });
        tl.css({//dialog title
            height: '25px',
            'line-height': '25px',
            margin: 0,
            padding: 0,
            width: '100%'
        });
        h = $(document).height();
        w = $(document).width();
        var tempT = (parseInt($(window).height()) - parseInt(d.height())) / 2
        t = (tempT >= 0 ? tempT : 0) + $(window).scrollTop();
        tempL = (parseInt($(window).width()) - parseInt(d.width())) / 2
        l = (tempL >= 0 ? tempL : 0) + $(window).scrollLeft();
        if (b)
        {
            b.css({//blocker
                width: w,
                height: h,
                left: 0,
                top: 0,
                position: 'absolute',
                'background-color': '#000',
                'z-index': 9999,
                filter: "alpha(opacity=50)",
                "-moz-opacity": '0.5',
                opacity: '0.5'
            });
        }

        d.css({ top: t, left: l }).easydrag()
        d.setHandler(d.children("dt"));
        //-------------------  show & hide  -------------------------//
        o.appendTo(dd).show();
        dd.children().show();
        if (b)
            b.show();
        d.show();
        //-----------------   close button clicked
        d.children("dt").children(".jdclose").click(function()
        {
            o.appendTo(op).hide();
            if (b)
                b.remove();
            d.remove();
            return false;
        });
        //------------------  drag & drop   --------------------------//
        d.mydrag({ container: $("body"), handler: d.children("dt") });
        //d.setHandler(d.children("dt"));
        return o;
    }

    jDClose = function()
    {
        if (o && op && d && b)
        {
            o.appendTo(op).hide();
            b.remove();
            d.remove();
            o = null;
            op = null;
            d = null;
            b = null;
            if (typeof (callback) == 'function')
                callback();
        }
        else
        {
            return;
        }
    }
})(jQuery)