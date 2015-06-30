var moment = require('moment');
var bookingDbo = require('../models/booking');
var roomDbo = require('../models/room');
var Booking = bookingDbo.Booking.model;
var Room = roomDbo.Room.model;
/**
 * GET /rooms
 * @param req
 * @param res
 * @returns {}
 */
exports.get_rooms = function (req, res, next) {
    Room.find({}).then(function (rooms) {
        res.json(rooms);
    }, function (err) { return next(err); });
};
exports.get_room = function (req, res, next) {
    Room.findById(req.params.id).populate('bookings').then(function (r) {
        res.json(r);
    }, function (err) { return next(err); });
};
/**
 * POST /rooms
 * @param req
 * @param res
 * @param next
 * @returns {}
 */
exports.create_room = function (req, res, next) {
    req.checkBody('displayname', 'Invalid displayname').notEmpty().isAlpha();
    console.log(req.body);
    Room.create(req.body).then(function (r) {
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
    var reqDayStart = moment(req.body.start).startOf('day');
    var reqDayEnd = moment(req.body.end).endOf('day');
    Booking.find({
        start: {
            $gte: reqDayStart.toDate()
        },
        end: {
            $lte: reqDayEnd.toDate()
        }
    }).then(function (bs) {
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
    }, function (err) { return next(err); }).then(function (newBooking) {
        res.json(newBooking);
    }, function (err) { return next(err); });
    /*Room.findById(req.params.id).then((r) => {
        r.populate('bookings');
    }, (err) => next(err));*/
};
