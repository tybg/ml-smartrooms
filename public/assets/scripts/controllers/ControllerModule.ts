/**
    Primary entry point for controllers, declares the 'smartrooms.controllers' module and imports all controller definitions to compose the module
*/

import angular = require('angular');
import FloorplanViewCtrl = require('./FloorplanViewCtrl');
var moduleDeclaration = (() => {
    console.log('declaring controller module');
    angular.module('smartrooms.controllers', [])
        .controller('FloorplanViewCtrl', FloorplanViewCtrl.Controller);
})();

export = moduleDeclaration;