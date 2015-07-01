"use strict";

require.config({
    baseUrl: '/build/scripts/',
    paths: {
        'angular': 'angular',
        'angular-animate': 'angular-animate.min',
        'angular-aria': 'angular-aria.min',
        'angular-cookies': 'angular-cookies.min',
        'angular-messages': 'angular-messages.min',
        'angular-route': 'angular-route.min',
        'angular-sanitize': 'angular-sanitize.min',
        'angular-touch': 'angular-touch.min',
        'angular-strap': 'angular-strap.min',
        'angular-strap.tpl': 'angular-strap.tpl.min',
        'angular.ui.router': 'angular-ui-router.min',
        //'angularAMD': 'angularAMD.min',
        //'ngload': 'ngload.min',
        'restangular': 'restangular.min',
        'jquery': 'jquery-2.1.4.min',
        'socket.io-client': 'socket.io.min',
        'lib': 'lib.min'
    },
    shim: {
        'angular': {
            exports: 'angular',
            deps: ['jquery', 'domready!']
        },
        //'angularAMD': ['angular'],
        //'ngload': ['angularAMD'],
        'angular-animate': ['angular'],
        'angular-aria': ['angular'],
        'angular-cookies': ['angular'],
        'angular-messages': ['angular'],
        'angular-route': ['angular'],
        'angular-sanitize': ['angular'],
        'angular-touch': ['angular'],
        'angular-strap': ['angular'],
        'angular-strap.tpl': ['angular', 'angular-strap'],
        'angular.ui.router': ['angular'],
        'restangular': ['angular'],
        'lib': ['jquery']
    },
    deps: ['app']
});