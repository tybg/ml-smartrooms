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
//import domready = require('domready');
//import ThreePsTutorial = require('ThreePsTutorial');
var angular = require('angular');
var angularRoute = require('angular-route');
var restangular = require('restangular');
var uiRouter = require('angular.ui.router');
var floorplan = require('controllers/floorplan');
var globaldirectives = require('directives/NgGlobals');
var lib = require('lib');
var fpCtrl = new floorplan.Floorplan();
var globalDirectives = new globaldirectives.GlobalDirectives();
var blah = [angularRoute, restangular, uiRouter, lib];
//import angularAMD = require('angularAMD');
var app = angular.module('smartrooms', ['smartrooms.floorplancontrollers', 'smartrooms.globaldirectives', 'restangular', 'ui.router']);
app.config(['$httpProvider', 'RestangularProvider', '$stateProvider', '$urlRouterProvider', function ($httpProvider, RestangularProvider, $stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        RestangularProvider.setResponseExtractor(function (resp, oper, url) {
            //console.log('OnResponse', resp, oper, url);
            var newResponse = resp;
            if (angular.isArray(resp)) {
                //console.log('is array');
                newResponse.originalElement = null;
                angular.forEach(newResponse, function (value, keyOrIdx) {
                    //Copy each original (un-"Restangularized") value to an originalElement property on the value
                    if (parseInt(keyOrIdx) === keyOrIdx) {
                        if (newResponse.originalElement === null)
                            newResponse.originalElement = [];
                        //Copy the value to an originalElement object on the response object itself (so we can access each all originalValues from one location)
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
        $stateProvider.state('home', {
            url: '/',
            controller: 'FloorplanViewCtrl',
            template: '<div id="floorplandiv"><div floorplan-view></div></div>'
        });
    }]);
app.run(function () {
});
angular.bootstrap(document, ['smartrooms']);
//# sourceMappingURL=app.js.map