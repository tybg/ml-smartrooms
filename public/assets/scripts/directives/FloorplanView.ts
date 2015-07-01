/// <reference path="../../../../typings/angularjs/angular.d.ts" />
import ThreePsTutorial = require("../ThreePsTutorial");

export interface IFloorPlanViewScope extends ng.IScope{
    floorplanRender: ThreePsTutorial.BoxExample;
}

export class FloorplanViewDirective implements ng.IDirective{
    link: (scope: IFloorPlanViewScope, elem: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
    templateUrl = 'templates/floorplan/main.html';
    restrict = 'EA';
    scope = true;

    floorplanRender : ThreePsTutorial.BoxExample;

    constructor($window : ng.IWindowService){
        //See http://blog.aaronholmes.net/writing-angularjs-directives-as-typescript-classes/#comment-2111298002 for why this is necessary
        FloorplanViewDirective.prototype.link = (scope: IFloorPlanViewScope, elem: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            this.floorplanRender = new ThreePsTutorial.BoxExample(elem.find('#map-container')[0]);
            $window.addEventListener('resize', this.resizeListener, false);

            scope.$on('$destroy', (evt: ng.IAngularEvent) => this.destruct($window));
        }
    }

    private resizeListener() {
        this.floorplanRender.camera.aspect = this.floorplanRender.renderContainer.clientWidth / this.floorplanRender.renderContainer.clientHeight;
        this.floorplanRender.camera.updateProjectionMatrix();
        this.floorplanRender.renderer.setSize(this.floorplanRender.renderContainer.clientWidth, this.floorplanRender.renderContainer.clientHeight);
    }

    static Factory(){
        var directive = ($window : ng.IWindowService) => {
            return new FloorplanViewDirective($window);
        };

        directive['$inject'] = ['$window'];

        return directive;
    }

    private destruct($window : ng.IWindowService){
        console.log('FloorplanViewDirective destruct');
        $window.removeEventListener('resize', this.resizeListener);

        angular.element(this.floorplanRender.gui.domElement).remove();
    }
}
/*var directiveFactory: ng.IDirectiveFactory = () => {
    return {
        scope: true,
        restrict: 'EA',
        templateUrl: 'templates/floorplan/main.html',
        link(scope: ng.IScope, elem: angular.IAugmentedJQuery) {
            //console.log('linked');
            scope.floorplanRender = new ThreePsTutorial.BoxExample(elem.find('#map-container')[0]);

            window.addEventListener('resize', () => {
                this.floorplanRender.camera.aspect = this.floorplanRender.renderContainer.clientWidth / this.floorplanRender.renderContainer.clientHeight;
                this.floorplanRender.camera.updateProjectionMatrix();
                this.floorplanRender.renderer.setSize(this.floorplanRender.renderContainer.clientWidth, this.floorplanRender.renderContainer.clientHeight);
            }, false);

            $('.dg.main').css('margin-top', this.floorplanRender.renderer.domElement.offsetTop + 'px');
        }
    }
};*/
