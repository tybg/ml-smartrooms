/**
    Primary entry point for directives, declares the 'smartrooms.directives' module and imports all directive factories to compose the module
*/
var angular = require('angular');
var NgGlobals = require('./NgGlobals');
var FloorplanView = require('./FloorplanView');
var moduleDeclaration = (function () {
    console.log('declaring directive module');
    angular.module('smartrooms.directives', [])
        .directive('floorplanView', FloorplanView)
        .directive('withRipples', NgGlobals.ripplesDirective)
        .directive('withripples', NgGlobals.ripplesDirective)
        .directive('cardImage', NgGlobals.ripplesDirective)
        .directive('btn', NgGlobals.ripplesDirective)
        .directive('input', NgGlobals.inputDirective)
        .directive('select', NgGlobals.inputDirective)
        .directive('textarea', NgGlobals.inputDirective);
})();
module.exports = moduleDeclaration;
//# sourceMappingURL=DirectiveModule.js.map