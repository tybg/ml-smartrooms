
import $ = require('jquery');

export class GlobalDirectives {
    module: ng.IModule;
    inputDirective: ng.IDirectiveFactory = () => {
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
    
    ripplesDirective: ng.IDirectiveFactory = () => {
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

    inputElements = ['input', 'textarea', 'select'];
    constructor() {
        this.module = angular.module('smartrooms.globaldirectives', []);
        for (let i = 0; i < this.inputElements.length; i++) {
            this.module.directive(this.inputElements[i], this.inputDirective);
        }

        this.module.directive('withRipples', this.ripplesDirective);
        this.module.directive('withripples', this.ripplesDirective);
        this.module.directive('cardImage', this.ripplesDirective);
        this.module.directive('btn', this.ripplesDirective);
    }
}