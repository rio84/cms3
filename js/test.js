(function($)
{
    $.fn.Helpline = function(options)
    {
        return this.each(function()
        {
            var _currentObj = $(this), _dimension = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
            if (_currentObj)
            {
                _dimension.width = _currentObj.outerWidth(),
            _dimension.height = _currentObj.outerHeight(),
                _dimension.left = _currentObj.offset().left,
_dimension.right = _dimension.left + _dimension.width,
_dimension.top = _currentObj.offset().top,
_dimension.bottom = _dimension.top + _dimension.height;
            }
            var creatline = function()
            {
                var $line = $("<hr />"),
                vlcolor = '#2E96E8',
                vlwidth = _dimension.width * 2;
                $line.css({
                    'border-color': vlcolor,
                    width: vlwidth + 'px',
                    position: 'absolute',
                    left: 0,
                    top: _dimension.top - 1,
                    'z-index': 100
                });
                $("body").append($line);
            };
            creatline();
        });

    }

})(jQuery)


function showline()
{

}