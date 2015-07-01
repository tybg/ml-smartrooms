/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../typings/angular-ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../typings/restangular/restangular.d.ts" />
/// <reference path="../../../typings/require/require.d.ts" />
/// <reference path="../../../typings/threejs/three.d.ts" />
/// <reference path="../../../typings/threejs/three-orbitcontrols.d.ts" />
/// <reference path="../../../typings/lodash/lodash.d.ts" />
/// <reference path="../../../typings/tween.js/tween.js.d.ts" />
/// <reference path="../../../typings/dat/dat.d.ts" />
/// <reference path="../../../typings/ripples/ripples.d.ts" />
/// <reference path="../../../typings/domready/domready.d.ts" />
/// <reference path="../../../typings/socket.io-client/socket.io-client.d.ts" />
"use strict";
var angular = require('angular');
var angularRoute = require('angular-route');
var restangular = require('restangular');
var uiRouter = require('angular.ui.router');
var ProviderModule = require('providers/ProviderModule');
var ControllerModule = require('controllers/ControllerModule');
var DirectiveModule = require('directives/DirectiveModule');
var lib = require('lib');
var blah = [angularRoute, restangular, uiRouter, lib, ProviderModule, ControllerModule, DirectiveModule];
var app = angular.module('smartrooms', ['smartrooms.providers', 'smartrooms.directives', 'smartrooms.controllers', 'restangular', 'ui.router']);
app.config(['$httpProvider', 'RestangularProvider', '$stateProvider', '$urlRouterProvider', function ($httpProvider, RestangularProvider, $stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/floorplan');
        RestangularProvider.setResponseExtractor(function (resp, oper, url) {
            var newResponse = resp;
            if (angular.isArray(resp)) {
                newResponse.originalElement = null;
                angular.forEach(newResponse, function (value, keyOrIdx) {
                    if (parseInt(keyOrIdx) === keyOrIdx) {
                        if (newResponse.originalElement === null)
                            newResponse.originalElement = [];
                        newResponse.originalElement.push(angular.copy(value));
                        value.originalElement = angular.copy(value);
                    }
                    else {
                        if (newResponse.originalElement === null)
                            newResponse.originalElement = {};
                        newResponse.originalElement[keyOrIdx] = angular.copy(value);
                    }
                });
            }
            else {
                newResponse.originalElement = angular.copy(resp);
            }
            if (newResponse.Results !== undefined && newResponse.Total !== undefined && newResponse.Offset !== undefined) {
                newResponse.Results.Total = newResponse.Total;
                newResponse.Results.Offset = newResponse.Offset;
                newResponse.Results.originalElement = newResponse.originalElement.Results;
                return newResponse.Results;
            }
            return newResponse.Results !== undefined ? newResponse.Results :
                newResponse.Data !== undefined ? newResponse.Data : newResponse;
        });
        $stateProvider
            .state('floorplan', {
            url: '/floorplan',
            controller: 'FloorplanViewCtrl',
            template: '<div id="floorplandiv"><div floorplan-view></div></div>'
        })
            .state('bookings', {
            url: '/bookings',
            template: '<p>Placeholder</p>'
        });
    }]);
app.run(function () {
});
angular.bootstrap(document, ['smartrooms']);
