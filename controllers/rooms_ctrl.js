/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>
/// <reference path="../typings/express-validator/express-validator.d.ts"/>
/// <reference path="../typings/socket.io-client/socket.io-client.d.ts"/>
/// <reference path="../typings/moment/moment.d.ts"/>
/// <reference path="../typings/mongoose/mongoose.d.ts"/>
/// <reference path="../typings/lodash/lodash.d.ts"/>
var _ = require('lodash');
var moment = require('moment');
var booking = require('../models/Booking');
var room = require('../models/Room');
var BookingModel = booking.Model;
var RoomModel = room.Model;
/**
 * GET /rooms
 * @param req
 * @param res
 * @returns {}
 */
exports.get_rooms = function (req, res, next) {
    RoomModel.find({}).then(function (rooms) {
        res.json(rooms);
    }, function (err) { return next(err); });
};
/**
 * GET /rooms/:id
 * @param req
 * @param res
 * @param next
 */
exports.get_room = function (req, res, next) {
    RoomModel.findById(req.params.id).then(function (r) {
        res.json(r);
    }, function (err) { return next(err); });
};
exports.get_room_bookings = function (req, res, next) {
    BookingModel.find({ room: req.params.id }).then(function (bs) {
        res.json(bs);
    }, function (err) { return next(err); });
};
/**
 * POST /rooms
 * @param req
 * @param res
 * @param next
 */
exports.create_room = function (req, res, next) {
    req.checkBody('displayname', 'Invalid displayname').notEmpty().isAlpha();
    console.log(req.body);
    RoomModel.create(req.body).then(function (r) {
        res.json(r);
    }, function (err) { return next(err); });
};
/**
 * POST /rooms/:id/bookings
 * @param req
 * @param res
 * @param io
 */
exports.room_post_bookings = function (req, res, next, io) {
    var reqDayStart = moment.utc(req.body.start).startOf('day');
    var reqDayEnd = moment.utc(req.body.end).endOf('day');
    BookingModel.find({
        start: {
            $gte: reqDayStart.toDate()
        },
        end: {
            $lte: reqDayEnd.toDate()
        }
    }).then(function (bs) {
        //console.log('found ' + bs.length + ' bookings between ' + reqDayStart.toISOString() + ' and ' + reqDayEnd.toISOString());
        var newBooking = new BookingModel(_.assign({}, req.body));
        newBooking.save(function (err) {
            if (err)
                next(err);
            res.json(newBooking);
        });
    });
};
