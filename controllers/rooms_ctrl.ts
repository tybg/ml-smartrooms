/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>
/// <reference path="../typings/express-validator/express-validator.d.ts"/>
/// <reference path="../typings/socket.io-client/socket.io-client.d.ts"/>
/// <reference path="../typings/moment/moment.d.ts"/>
/// <reference path="../typings/mongoose/mongoose.d.ts"/>
/// <reference path="../typings/lodash/lodash.d.ts"/>
import _ = require('lodash');
import moment = require('moment');
import mongoose = require('mongoose');
import express = require('express');
import IBooking = require('../models/IBooking');
import booking = require('../models/Booking');
import IRoom = require('../models/IRoom');
import room = require('../models/Room');
var BookingModel = booking.Model;
var RoomModel = room.Model;

export interface GetRoomRequest extends express.Request {
    params: { id: string };
}

export interface BookRoomRequest extends express.Request {
    params: { id: string };
    body: IBooking;
}

/**
 * GET /rooms
 * @param req 
 * @param res 
 * @returns {} 
 */
export var get_rooms = (req: express.Request, res: express.Response, next : Function) => {
    RoomModel.find({}).then((rooms) => {
        res.json(rooms);
    }, (err) => next(err));
};

/**
 * GET /rooms/:id
 * @param req 
 * @param res 
 * @param next 
 */
export var get_room = (req: GetRoomRequest, res: express.Response, next: Function) => {
    RoomModel.findById(req.params.id).then((r) => {
        res.json(r);
    }, (err) => next(err));
};

export var get_room_bookings = (req: GetRoomRequest, res : express.Response, next: Function) => {
    BookingModel.find({ room: req.params.id }).then(bs => {
        res.json(bs);
    }, err => next(err));
}

/**
 * POST /rooms
 * @param req 
 * @param res 
 * @param next
 */
export var create_room = (req: express.Request, res: express.Response, next: Function) => {
    req.checkBody('displayname', 'Invalid displayname').notEmpty().isAlpha();
    console.log(req.body);
    RoomModel.create(req.body).then((r) => {
        res.json(r);
    }, (err) => next(err));
}

/**
 * POST /rooms/:id/bookings
 * @param req 
 * @param res 
 * @param io 
 */
export var room_post_bookings = (req: BookRoomRequest, res: express.Response, next: Function, io: SocketIOClient.Socket) => {
    var reqDayStart = moment.utc(req.body.start).startOf('day');
    var reqDayEnd = moment.utc(req.body.end).endOf('day');
    BookingModel.find({
        start: {
            $gte: reqDayStart.toDate()
        },
        end: {
            $lte: reqDayEnd.toDate()
        }
    }).then((bs) => {
        //console.log('found ' + bs.length + ' bookings between ' + reqDayStart.toISOString() + ' and ' + reqDayEnd.toISOString());
        var newBooking = new BookingModel(_.assign({}, req.body));
        newBooking.save(err => {
            if (err) next(err);
            res.json(newBooking);
        });
    });
};