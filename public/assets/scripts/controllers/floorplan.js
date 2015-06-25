/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/* Example only -- probably not a good idea to do this, should rather import controllers into the main app.ts
import _app = require("../app");
var app = <ng.IModule>_app;*/
var ThreePsTutorial = require("../ThreePsTutorial");
var FloorplanControllers = (function () {
    function FloorplanControllers() {
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
    FloorplanControllers.prototype.floorplanViewCtrl = function ($scope) {
        $scope.message = 'This is a message from $scope';
    };
    FloorplanControllers.prototype.floorplanViewDirective = function () {
        var fpViewDir = {
            scope: true,
            restrict: 'EA',
            link: function (scope) {
                console.log('linked');
                var boxExample = new ThreePsTutorial.BoxExample();
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
            }
        };
        return fpViewDir;
    };
    return FloorplanControllers;
})();
exports.FloorplanControllers = FloorplanControllers;
//# sourceMappingURL=floorplan.js.map