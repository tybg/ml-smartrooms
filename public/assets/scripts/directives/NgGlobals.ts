import $ = require('jquery');

class GlobalDirectives {
    static inputDirective: ng.IDirectiveFactory = () => {
        return {
            restrict: 'E',
            link($scope, $element) {
                if ($element.hasClass('form-control')) {
                    $.material.input($element);
                } else {
                    const type = $element.attr('type');
                    const func = $.material[type];
                    if (typeof (func) === 'function') {
                        func($element);
                    }
                }
            }
        }
    };
    
    static ripplesDirective: ng.IDirectiveFactory = () => {
        return {
            restrict: 'C',
            link($scope, $element) {
                if ($element.hasClass('withoutripple')) {
                    return;
                }
                $.material.ripples($element);
            }
        }
    }
}

export = GlobalDirectives;