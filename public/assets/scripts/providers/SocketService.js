/// <reference path="../../../../typings/socket.io-client/socket.io-client.d.ts" />
var io = require('socket.io-client');
//OO-style declaration
//See http://stackoverflow.com/a/25540282/1122000 for good example
var Service = (function () {
    function Service($rootScope) {
        this.$rootScope = $rootScope;
        this.socket = io.connect();
    }
    Service.prototype.on = function (evtName, cb) {
        var _this = this;
        this.socket.on(evtName, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            _this.$rootScope.$apply(function () {
                cb.apply(_this.socket, args);
            });
        });
    };
    Service.prototype.emit = function (evtName, data, cb) {
        var _this = this;
        this.socket.emit(evtName, data, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            _this.$rootScope.$apply(function () {
                cb.apply(_this.socket, args);
            });
        });
    };
    Service.$inject = ['$rootScope'];
    return Service;
})();
exports.Service = Service;
//# sourceMappingURL=SocketService.js.map