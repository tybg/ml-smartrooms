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
import angular = require('angular');
import angularRoute = require('angular-route');
import restangular = require('restangular');
import uiRouter = require('angular.ui.router');
import floorplan = require('controllers/floorplan');
import globaldirectives = require('directives/NgGlobals');
import lib = require('lib');

//Instantiate angular modules
var fpCtrl = new floorplan.Floorplan();
var globalDirectives = new globaldirectives.GlobalDirectives();
//Force TS compiler to include these
var blah = [angularRoute, restangular, uiRouter, lib];

var app = angular.module('smartrooms', ['smartrooms.floorplancontrollers', 'smartrooms.globaldirectives', 'restangular', 'ui.router']);
app.config(['$httpProvider', 'RestangularProvider', '$stateProvider', '$urlRouterProvider', ($httpProvider : ng.IHttpProvider, RestangularProvider : restangular.IProvider, $stateProvider : router.IStateProvider, $urlRouterProvider : ng.route.IRouteProvider) => {
    $urlRouterProvider.otherwise('/');
    RestangularProvider.setResponseExtractor((resp, oper, url) => {
        //console.log('OnResponse', resp, oper, url);
        var newResponse = resp;
        if (angular.isArray(resp)) {
            //console.log('is array');
            newResponse.originalElement = null;
            angular.forEach(newResponse, (value, keyOrIdx) => {
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
        } else {
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

app.run(() => {
});

angular.bootstrap(document, ['smartrooms']);