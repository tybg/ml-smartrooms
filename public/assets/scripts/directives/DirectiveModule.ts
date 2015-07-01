/**
    Primary entry point for directives, declares the 'smartrooms.directives' module and imports all directive factories to compose the module
*/

import angular = require('angular');
import NgGlobals = require('./NgGlobals');
import FloorplanView = require('./FloorplanView');
var moduleDeclaration = (() => {
    console.log('declaring directive module');
    angular.module('smartrooms.directives', [])
        .directive('floorplanView', FloorplanView.FloorplanViewDirective.Factory())
        .directive('withRipples', NgGlobals.ripplesDirective)
        .directive('withripples', NgGlobals.ripplesDirective)
        .directive('cardImage', NgGlobals.ripplesDirective)
        .directive('btn', NgGlobals.ripplesDirective)
        .directive('input', NgGlobals.inputDirective)
        .directive('select', NgGlobals.inputDirective)
        .directive('textarea', NgGlobals.inputDirective);
})();

export = moduleDeclaration;