/// <reference path="../../../../typings/socket.io-client/socket.io-client.d.ts" />

import io = require('socket.io-client');

//OO-style declaration
//See http://stackoverflow.com/a/25540282/1122000 for good example

export class Service {
    private socket = io.connect();

    static $inject = ['$rootScope'];
    constructor(public $rootScope: ng.IRootScopeService) {

    }

    on(evtName: string, cb: Function) {
        this.socket.on(evtName, (...args: any[]) => {
            this.$rootScope.$apply(() => {
                cb.apply(this.socket, args);
            });
        });
    }

    emit(evtName: string, data: Object, cb: Function) {
        this.socket.emit(evtName, data, (...args: any[]) => {
            this.$rootScope.$apply(() => {
                cb.apply(this.socket, args);
            });
        });
    }
}