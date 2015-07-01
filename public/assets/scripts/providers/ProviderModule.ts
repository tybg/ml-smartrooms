/**
    Primary entry point for providers, declares the 'smartrooms.providers' module and imports all providers definitions to compose the module
*/

import angular = require('angular');
import SocketService = require('./SocketService');
var moduleDeclaration = (() => {
    console.log('declaring provider module');
    angular.module('smartrooms.providers', [])
        .service('socket', SocketService.Service);
})();

export = moduleDeclaration;