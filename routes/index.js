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
    
    router.get('/bookroom', function(req, res, next){
        console.log(req.query);
        io.emit('book', parseInt(req.query.room, 10));
        controller.home(req, res, next);
    });
    
    return router;
};