/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>
var express = require('express');
var controller = require('../controllers/rooms_ctrl');
var router = express.Router();
var roomsRoutes = function (io) {
    router.get('/', controller.get_rooms);
    router.get('/:id', controller.get_room);
    router.get('/:id/bookings', controller.get_room_bookings);
    router.post('/', controller.create_room);
    router.post('/:id/bookings', function (req, res, next) {
        controller.room_post_bookings(req, res, next, io);
    });
    return router;
};
module.exports = roomsRoutes;
