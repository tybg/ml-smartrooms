/**
    Primary entry point for providers, declares the 'smartrooms.providers' module and imports all providers definitions to compose the module
*/
var angular = require('angular');
var SocketService = require('./SocketService');
var moduleDeclaration = (function () {
    console.log('declaring provider module');
    angular.module('smartrooms.providers', [])
        .service('socket', SocketService.Service);
})();
module.exports = moduleDeclaration;
//# sourceMappingURL=ProviderModule.js.map