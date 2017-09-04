/// <reference path="../js/jquery-1.3.2-vsdoc2.js" />
/// <reference path="serializer.js" />

var HtmlTemplate =function(){ };

HtmlTemplate.prototype = {
    currentobj: null,
    displayType: 0,
    initcurrentObj: function(objID) {
        this.currentobj = $("#" + objID);
    },
    setDisplay: function(val) {
        this.displayType = val;
    },
    getHtml: function() {
        if (this.currentobj == null) {
            alert("您没选择任何模块！");
            return;
        }
        //var templ1 = "templ" + this.currentobj.attr("id");
        // $("#txthtmlarea").val($("#" + templ1).html());

        $("#txthtmlarea").val(Serializer.unserialize(this.currentobj.attr("templdata")));
    },
    buildDataHtml: function(sourceHtml, disType) {   ///distype 0 list 1detail
        $.ajax({
            url: "data.xml",
            dataType: "xml",
            success: function(result) {
                var xmlobj = $(result).find("product");
                switch (disType) {
                    case 0:
                        var totaltemphtml = "";
                        for (var i = 0; i < xmlobj.length; i++) {
                            var temphtml = sourceHtml.replace("#_name", $(xmlobj[i]).find("name").text()); ;
                            temphtml = temphtml.replace("#_series", $(xmlobj[i]).find("series").text());
                            temphtml = temphtml.replace("#_price", $(xmlobj[i]).find("price").text());
                            temphtml = temphtml.replace("#_notes", $(xmlobj[i]).find("notes").text());
                            temphtml = temphtml.replace("#_pic", $(xmlobj[i]).find("pic").text());
                            totaltemphtml += temphtml
                        }
                        sourceHtml = totaltemphtml;
                        break;
                    case 1:
                        var selectvalue = $("#ddlproduct").val();
                        for (var i = 0; i < xmlobj.length; i++) {
                            var tempxmlobj = $(xmlobj[i]);
                            if (selectvalue == tempxmlobj.find("id").text()) {
                                sourceHtml = sourceHtml.replace("#_name", tempxmlobj.find("name").text());
                                sourceHtml = sourceHtml.replace("#_series", tempxmlobj.find("series").text());
                                sourceHtml = sourceHtml.replace("#_price", tempxmlobj.find("price").text());
                                sourceHtml = sourceHtml.replace("#_notes", tempxmlobj.find("notes").text());
                                sourceHtml = sourceHtml.replace("#_pic", tempxmlobj.find("pic").text());
                            }
                        }
                        break;
                }
                htmTp.currentobj.html(sourceHtml);
            }
        });
    },
    setHtml: function() {
        if (this.currentobj == null) {
            alert("您没选择任何模块！");
            return;
        }
        var sourcehtml = $("#txthtmlarea").val();

        //var templ = "templ" + this.currentobj.attr("id");
        //$("<script type='text/javascript'' id='" + templ + "'> /*" + Serializer.serialize(sourcehtmlobj) + "*/</script>").appendTo($(document));
        this.currentobj.attr("templdata", Serializer.serialize(sourcehtml));
        this.buildDataHtml(sourcehtml, htmTp.displayType);

    }

}

var htmTp = new HtmlTemplate();
