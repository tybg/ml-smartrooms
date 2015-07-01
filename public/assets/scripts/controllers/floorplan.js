/// <reference path="../../../../typings/angularjs/angular.d.ts" />
var Floorplan = (function () {
    /*private floorplanViewDirective() {
        var fpViewDir: ng.IDirective = {
            scope: true,
            restrict: 'EA',
            templateUrl: 'templates/floorplan/main.html',
            link(scope: ng.IScope, elem : ng.IAugmentedJQuery) {
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
        return fpViewDir;
    }*/
    function Floorplan() {
        this.module = angular.module('smartrooms.floorplancontrollers', ['restangular'])
            .controller('FloorplanViewCtrl', ['$scope', this.floorplanViewCtrl]);
        //.directive('floorplanView', this.floorplanViewDirective);
    }
    Floorplan.prototype.floorplanViewCtrl = function ($scope) {
        $scope.message = 'This is a message from $scope';
    };
    return Floorplan;
})();
exports.Floorplan = Floorplan;
//# sourceMappingURL=floorplan.js.map