function getNumbers(iCurrent, iTotal)
{
    var PREVIOUS_NUMBER = 2; //最前面显示数字位数
    var NEXT_NUMBER = 2; //最后面显示数字位数
    var DISPLAY_NUMBER = 5; //中间显示数字位数

    if (iCurrent > iTotal || iCurrent < 1)
    {
        throw new Error("参数错误");
    }
    var arrReturn = [];
    var iDisplay_Pre = Math.floor(DISPLAY_NUMBER / 2); //当前页之前显示数字位数
    var iDisplay_Nex = DISPLAY_NUMBER - iDisplay_Pre - 1; //当前页之后显示数字位数

    var bQSLH = true; //是否有前省略号
    var bHSLH = true; //是否有后省略号

    var iMidStart = iCurrent - iDisplay_Pre; //中间部分起始数字
    var iMidEnd =parseInt( iCurrent) +parseInt( iDisplay_Nex); //中间部分结束数字

    if (iTotal <= DISPLAY_NUMBER)	//总数不足以显示全部位数
    {
        iMidStart = 1;
        iMidEnd = iTotal;
        bQSLH = bHSLH = false;
    }
    else
    {
        if (iCurrent <= iDisplay_Pre)	//需向后补足位数
        {
            iMidStart = 1;
            iMidEnd = DISPLAY_NUMBER;
            bQSLH = false;
        }
        if (iCurrent > iTotal - iDisplay_Nex)	//需向前补足位数
        {
            iMidStart = iTotal - DISPLAY_NUMBER + 1;
            iMidEnd = iTotal;
            bHSLH = false;
        }
    }

    for (var i = iMidStart; i <= iMidEnd; i++)
    {
        arrReturn.push(i);
    }

    if (bQSLH && arrReturn[0] > PREVIOUS_NUMBER + 1)	//需添加前省略号
    {
        arrReturn.unshift("…");
        for (var i = PREVIOUS_NUMBER; i >= 1; i--)
        {
            arrReturn.unshift(i);
        }
    }
    else
    {
        for (var i = arrReturn[0] - 1; i >= 1; i--)
        {
            arrReturn.unshift(i);
        }
    }

    if (bHSLH && arrReturn[arrReturn.length - 1] + NEXT_NUMBER < iTotal)	//需添加后省略号
    {
        arrReturn.push("…");
        for (var i = iTotal - NEXT_NUMBER + 1; i <= iTotal; i++)
        {
            arrReturn.push(i);
        }
    }
    else
    {
        for (var i = arrReturn[arrReturn.length - 1] + 1; i <= iTotal; i++)
        {
            arrReturn.push(i);
        }
    }
    return arrReturn;
}
function createPager(currentindex,total)
{
if(isNaN(currentindex))
{
currentindex=1;
}
if(currentindex>total)
{
return "";
}
    var arr=  getNumbers(currentindex,total)
    var vHtml="<div class='jpager'>";
    $.each(arr,function(i,n){
    
    if(n==currentindex)
    {
        vHtml+="<span class='now'>"+n+"</span>";
    }
    else if(isNaN(n))
    {
        vHtml+=n;
    }
    else
        vHtml+="<a href='javascript:'>"+n+"</a>";
    });
    vHtml+="</div>";
    
 
    return vHtml;

}

(function($){

$.fn.jpager=function(current,total){
    
   var vHtm=createPager(current,total),
   oPager=$(vHtm),
   o=this;
    
    oPager.children("a").click(function(){
   
        o.jpager($.trim($(this).text()),total);
    });
    
    o.empty().append(oPager);

}

})(jQuery)