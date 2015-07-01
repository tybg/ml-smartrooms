var Controller = (function () {
    function Controller($scope) {
        $scope.pageState = {
            enableControls: true
        };
        $scope.message = 'This is a message from $scope';
    }
    Controller.$inject = ['$scope'];
    return Controller;
})();
exports.Controller = Controller;
//# sourceMappingURL=FloorplanViewCtrl.js.map