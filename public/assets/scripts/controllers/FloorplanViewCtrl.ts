export interface IFloorplanScope extends ng.IScope {
    message: string;
    pageState: {
        enableControls: boolean;
    };
}

export class Controller {
    static $inject = ['$scope'];
    constructor($scope: IFloorplanScope) {
        $scope.pageState = {
            enableControls: true
        };
        $scope.message = 'This is a message from $scope';
    }
}