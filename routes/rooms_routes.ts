/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>

import express = require('express');
import controller = require('../controllers/rooms_ctrl');

var router = express.Router();

var roomsRoutes = (io: SocketIOClient.Socket) => {
    router.get('/', controller.get_rooms);
    router.get('/:id', controller.get_room);
    router.post('/', controller.create_room);
    router.post('/:id/bookings', (req: controller.BookRoomRequest, res: express.Response, next: Function) => {
        controller.room_post_bookings(req, res, next, io);
    });

    return router;
};

export = roomsRoutes;