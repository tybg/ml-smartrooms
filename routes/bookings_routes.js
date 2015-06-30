/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>
var express = require('express');
var controller = require('../controllers/bookings_ctrl');
var router = express.Router();
var bookingsRoutes = function (io) {
    router.get('/', controller.get_bookings);
    router.get('/:id', function (req, res, next) {
        controller.get_booking(req, res, next);
    });
    return router;
};
module.exports = bookingsRoutes;
