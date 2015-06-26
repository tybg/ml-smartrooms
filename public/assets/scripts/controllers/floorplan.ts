/// <reference path="../../../../typings/angularjs/angular.d.ts" />

import ThreePsTutorial = require("../ThreePsTutorial");

interface IFloorplanScope extends ng.IScope {
    message: string;
}

export class Floorplan {
    module: ng.IModule;
    floorplanRender: ThreePsTutorial.BoxExample;

    private floorplanViewCtrl($scope: IFloorplanScope) {
        $scope.message = 'This is a message from $scope';
    }

    private floorplanViewDirective() {
        var fpViewDir: ng.IDirective = {
            scope: true,
            restrict: 'EA',
            templateUrl: 'templates/floorplan/main.html',
            link(scope: ng.IScope, elem : ng.IAugmentedJQuery) {
                console.log('linked');
                this.floorplanRender = new ThreePsTutorial.BoxExample(elem.find('#map-container')[0]);

                window.addEventListener('resize', () => {
                    this.floorplanRender.camera.aspect = this.floorplanRender.renderContainer.clientWidth / this.floorplanRender.renderContainer.clientHeight;
                    this.floorplanRender.camera.updateProjectionMatrix();
                    this.floorplanRender.renderer.setSize(this.floorplanRender.renderContainer.clientWidth, this.floorplanRender.renderContainer.clientHeight);
                }, false);

                $('.dg.main').css('margin-top', this.floorplanRender.renderer.domElement.offsetTop + 'px');
            }
        }
        return fpViewDir;
    }
    constructor() {
        this.module = angular.module('smartrooms.floorplancontrollers', ['restangular'])
            .controller('FloorplanViewCtrl', ['$scope', this.floorplanViewCtrl])
            .directive('floorplanView', this.floorplanViewDirective);
    }
}