/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>

import express = require('express');
import controller = require('../controllers/bookings_ctrl');

var router = express.Router();

var bookingsRoutes = (io: SocketIOClient.Socket) => {
    router.get('/', controller.get_bookings);
    router.get('/:id', (req: controller.GetBookingRequest, res: express.Response, next : Function) => {
        controller.get_booking(req, res, next);
    });

    return router;
};

export = bookingsRoutes;