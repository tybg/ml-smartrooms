/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>
var express = require('express');
var controller = require('../controllers/index');
var router = express.Router();
var indexRoutes = function () {
    router.get('/', function (req, res) {
        controller.home(req, res);
    });
    return router;
};
module.exports = indexRoutes;
