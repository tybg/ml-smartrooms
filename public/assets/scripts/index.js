/// <reference path="../../../typings/angularjs/angular.d.ts" />
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
var domready = require('domready');
var ThreePsTutorial = require('ThreePsTutorial');
var angular = require('angular');
require.config({
    baseUrl: '',
    paths: {
        'angular': 'angular.min',
        'angular-animate': 'angular-animate.min',
        'angular-aria': 'angular-aria.min',
        'angular-cookies': 'angular-cookies.min',
        'angular-messages': 'angular-messages.min',
        'angular-sanitize': 'angular-sanitize.min',
        'angular-touch': 'angular-touch.min',
        'angular-strap': 'angular-strap.min',
        'angular-strap.tpl': 'angular-strap.tpl.min',
        'angular-ui-router': 'angular-ui-router.min',
        'angularAMD': 'angularAMD.min',
        'ngload': 'ngload.min',
        'restangular': 'restangular.min',
        'jquery': 'jquery-2.1.4.min',
        'socket.io-client': 'socket.io.min'
    },
    shim: {
        'angular': {
            exports: 'angular',
            deps: ['jquery', 'domready!']
        },
        'angularAMD': ['angular'],
        'angular-animate': ['angular'],
        'angular-aria': ['angular'],
        'angular-cookies': ['angular'],
        'angular-messages': ['angular'],
        'angular-sanitize': ['angular'],
        'angular-touch': ['angular'],
        'angular-strap': ['angular'],
        'angular-strap.tpl': ['angular', 'angular-strap'],
        'angular-ui-router': ['angular'],
        'restangular': ['angular']
    }
});
var app = angular.module('smartrooms', ['']);
var boxExample;
domready(function () {
    boxExample = new ThreePsTutorial.BoxExample();
    window.addEventListener('resize', function () {
        boxExample.camera.aspect = boxExample.renderContainer.clientWidth / boxExample.renderContainer.clientHeight;
        boxExample.camera.updateProjectionMatrix();
        boxExample.renderer.setSize(boxExample.renderContainer.clientWidth, boxExample.renderContainer.clientHeight);
    }, false);
    $.material.init();
    $('.dg.main').css('margin-top', boxExample.renderer.domElement.offsetTop + 'px');
    document.getElementById('enable-controls').addEventListener('change', function (evt) {
        boxExample.orbitControls.enabled = this.checked;
    });
});
//# sourceMappingURL=index.js.map