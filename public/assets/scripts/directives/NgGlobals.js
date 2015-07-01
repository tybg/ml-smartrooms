var $ = require('jquery');
var GlobalDirectives = (function () {
    function GlobalDirectives() {
    }
    GlobalDirectives.inputDirective = function () {
        return {
            restrict: 'E',
            link: function ($scope, $element) {
                if ($element.hasClass('form-control')) {
                    $.material.input($element);
                }
                else {
                    var type = $element.attr('type');
                    var func = $.material[type];
                    if (typeof (func) === 'function') {
                        func($element);
                    }
                }
            }
        };
    };
    GlobalDirectives.ripplesDirective = function () {
        return {
            restrict: 'C',
            link: function ($scope, $element) {
                if ($element.hasClass('withoutripple')) {
                    return;
                }
                $.material.ripples($element);
            }
        };
    };
    return GlobalDirectives;
})();
module.exports = GlobalDirectives;
//# sourceMappingURL=NgGlobals.js.map