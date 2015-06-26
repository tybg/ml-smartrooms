var $ = require('jquery');
var GlobalDirectives = (function () {
    function GlobalDirectives() {
        this.inputDirective = function () {
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
        this.ripplesDirective = function () {
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
        this.inputElements = ['input', 'textarea', 'select'];
        this.module = angular.module('smartrooms.globaldirectives', []);
        for (var i = 0; i < this.inputElements.length; i++) {
            this.module.directive(this.inputElements[i], this.inputDirective);
        }
        this.module.directive('withRipples', this.ripplesDirective);
        this.module.directive('withripples', this.ripplesDirective);
        this.module.directive('cardImage', this.ripplesDirective);
        this.module.directive('btn', this.ripplesDirective);
    }
    return GlobalDirectives;
})();
exports.GlobalDirectives = GlobalDirectives;
//# sourceMappingURL=NgGlobals.js.map