/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>

var express = require('express'),
    router = express.Router(),
    controller = require('../controllers/index');

module.exports = function(io){
    router.get('/', function(req, res, next){
        io.emit('all', 'sup guyz!');
        controller.home(req, res, next);
    });
    
    router.get('/otherpage', controller.home);
    
    return router;
};