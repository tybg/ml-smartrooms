/**
    Primary entry point for controllers, declares the 'smartrooms.controllers' module and imports all controller definitions to compose the module
*/
var angular = require('angular');
var FloorplanViewCtrl = require('./FloorplanViewCtrl');
var moduleDeclaration = (function () {
    console.log('declaring controller module');
    angular.module('smartrooms.controllers', [])
        .controller('FloorplanViewCtrl', FloorplanViewCtrl.Controller);
})();
module.exports = moduleDeclaration;
//# sourceMappingURL=ControllerModule.js.map