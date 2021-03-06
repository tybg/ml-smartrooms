/// <reference path="../../../../typings/angularjs/angular.d.ts" />
var ThreePsTutorial = require("../ThreePsTutorial");
var directiveFactory = function () {
    return {
        scope: true,
        restrict: 'EA',
        templateUrl: 'templates/floorplan/main.html',
        link: function (scope, elem) {
            var _this = this;
            //console.log('linked');
            this.floorplanRender = new ThreePsTutorial.BoxExample(elem.find('#map-container')[0]);
            window.addEventListener('resize', function () {
                _this.floorplanRender.camera.aspect = _this.floorplanRender.renderContainer.clientWidth / _this.floorplanRender.renderContainer.clientHeight;
                _this.floorplanRender.camera.updateProjectionMatrix();
                _this.floorplanRender.renderer.setSize(_this.floorplanRender.renderContainer.clientWidth, _this.floorplanRender.renderContainer.clientHeight);
            }, false);
            $('.dg.main').css('margin-top', this.floorplanRender.renderer.domElement.offsetTop + 'px');
        }
    };
};
module.exports = directiveFactory;
//# sourceMappingURL=FloorplanView.js.map