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
import bookingDbo = require('../models/booking');
import roomDbo = require('../models/room');
var Booking = bookingDbo.Booking.model;
var Room = roomDbo.Room.model;

export interface GetRoomRequest extends express.Request {
    params: { id: string };
}

export interface BookRoomRequest extends express.Request {
    params: { id: string };
    body: bookingDbo.IBookingSchema;
}

/**
 * GET /rooms
 * @param req 
 * @param res 
 * @returns {} 
 */
export var get_rooms = (req: express.Request, res: express.Response, next : Function) => {
    Room.find({}).then((rooms) => {
        res.json(rooms);
    }, (err) => next(err));
};

export var get_room = (req: GetRoomRequest, res: express.Response, next: Function) => {
    Room.findById(req.params.id).populate('bookings').then((r) => {
        res.json(r);
    }, (err) => next(err));
};

/**
 * POST /rooms
 * @param req 
 * @param res 
 * @param next 
 * @returns {} 
 */
export var create_room = (req: express.Request, res: express.Response, next: Function) => {
    req.checkBody('displayname', 'Invalid displayname').notEmpty().isAlpha();
    console.log(req.body);
    Room.create(req.body).then((r) => {
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
    var reqDayStart = moment(req.body.start).startOf('day');
    var reqDayEnd = moment(req.body.end).endOf('day');
    Booking.find({
        start: {
            $gte: reqDayStart.toDate()
        },
        end: {
            $lte: reqDayEnd.toDate()
        }
    }).then((bs) => {
        console.log('found ' + bs.length + ' bookings between ' + reqDayStart.toISOString() + ' and ' + reqDayEnd.toISOString());
        var newBooking = Booking.create({
            start: req.body.start,
            end: req.body.end,
            subject: req.body.subject,
            details: req.body.details,
            isdeleted: req.body.isdeleted,
            room: req.params.id
        });
        return newBooking;
    }, err => next(err)).then<bookingDbo.IBookingSchema>((newBooking: bookingDbo.IBookingSchema) => {
        res.json(newBooking);
    }, err => next(err));
    /*Room.findById(req.params.id).then((r) => {
        r.populate('bookings');
    }, (err) => next(err));*/
};