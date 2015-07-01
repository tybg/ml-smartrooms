/// <reference path="../../../../typings/angularjs/angular.d.ts" />

import ThreePsTutorial = require("../ThreePsTutorial");
var directiveFactory: ng.IDirectiveFactory = () => {
    return {
        scope: true,
        restrict: 'EA',
        templateUrl: 'templates/floorplan/main.html',
        link(scope: ng.IScope, elem: angular.IAugmentedJQuery) {
            //console.log('linked');
            this.floorplanRender = new ThreePsTutorial.BoxExample(elem.find('#map-container')[0]);

            window.addEventListener('resize', () => {
                this.floorplanRender.camera.aspect = this.floorplanRender.renderContainer.clientWidth / this.floorplanRender.renderContainer.clientHeight;
                this.floorplanRender.camera.updateProjectionMatrix();
                this.floorplanRender.renderer.setSize(this.floorplanRender.renderContainer.clientWidth, this.floorplanRender.renderContainer.clientHeight);
            }, false);

            $('.dg.main').css('margin-top', this.floorplanRender.renderer.domElement.offsetTop + 'px');
        }
    }
};

export = directiveFactory;