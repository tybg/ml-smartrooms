/// <reference path="../../../../typings/angularjs/angular.d.ts" />

/* Example only -- probably not a good idea to do this, should rather import controllers into the main app.ts
import _app = require("../app");
var app = <ng.IModule>_app;*/

import ThreePsTutorial = require("../ThreePsTutorial");

interface IFloorplanScope extends ng.IScope {
    message: string;
}

export class FloorplanControllers {
    private floorplanViewCtrl($scope: IFloorplanScope) {
        $scope.message = 'This is a message from $scope';
    }
    private floorplanViewDirective() {
        var fpViewDir: ng.IDirective = {
            scope: true,
            restrict: 'EA',
            link(scope: ng.IScope) {
                console.log('linked');
                var boxExample = new ThreePsTutorial.BoxExample();

                window.addEventListener('resize', () => {
                    boxExample.camera.aspect = boxExample.renderContainer.clientWidth / boxExample.renderContainer.clientHeight;
                    boxExample.camera.updateProjectionMatrix();
                    boxExample.renderer.setSize(boxExample.renderContainer.clientWidth, boxExample.renderContainer.clientHeight);
                }, false);

                $.material.init();
                $('.dg.main').css('margin-top', boxExample.renderer.domElement.offsetTop + 'px');

                document.getElementById('enable-controls').addEventListener('change', function (evt) {
                    boxExample.orbitControls.enabled = this.checked;
                });
            }
        }
        return fpViewDir;
    }
    constructor() {
        angular.module('smartrooms.floorplancontrollers', ['restangular'])
            .controller('FloorplanViewCtrl', ['$scope', this.floorplanViewCtrl])
            .directive('floorplanView', this.floorplanViewDirective);
            /*
            var boxExample: ThreePsTutorial.BoxExample;
        domready(() => {
            boxExample = new ThreePsTutorial.BoxExample();
        
            window.addEventListener('resize', () => {
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
            */
    }
}