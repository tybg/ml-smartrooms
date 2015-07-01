/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>
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
//import room = require('../models/Room');

var BookingModel = booking.Model;
//var RoomModel = room.Model;


export interface GetBookingRequest extends express.Request {
    params: { id: string };
}
/**
 * GET /bookings
 * @param req 
 * @param res 
 * @returns {} 
 */
export var get_bookings = (req: express.Request, res: express.Response, next: Function) => {
    BookingModel.find({}).populate('room').then((bs) => {
        res.json(bs);
    }, (err) => next(err));
};

/**
 * GET /bookings/:id
 * @param req 
 * @param res 
 * @param io 
 */
export var get_booking = (req: GetBookingRequest, res: express.Response, next : Function) => {
    BookingModel.findById(req.params.id).then((b) => {
        res.json(b);
    }, (err) => next(err));
};