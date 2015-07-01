/// <reference path="../../../../typings/socket.io-client/socket.io-client.d.ts" />
var io = require('socket.io-client');
//OO-style declaration
//See http://stackoverflow.com/a/25540282/1122000 for good example
var Smartrooms;
(function (Smartrooms) {
    var Providers;
    (function (Providers) {
        var SocketFactory = (function () {
            function SocketFactory($rootScope) {
                this.$rootScope = $rootScope;
                this.socket = io.connect();
            }
            SocketFactory.prototype.on = function (evtName, cb) {
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
            SocketFactory.prototype.emit = function (evtName, data, cb) {
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
            SocketFactory.$inject = ['$rootScope'];
            return SocketFactory;
        })();
        Providers.SocketFactory = SocketFactory;
    })(Providers = Smartrooms.Providers || (Smartrooms.Providers = {}));
})(Smartrooms || (Smartrooms = {}));
//# sourceMappingURL=SocketFactory.js.map