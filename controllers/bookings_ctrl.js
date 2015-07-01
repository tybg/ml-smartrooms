var booking = require('../models/Booking');
//import room = require('../models/Room');
var BookingModel = booking.Model;
/**
 * GET /bookings
 * @param req
 * @param res
 * @returns {}
 */
exports.get_bookings = function (req, res, next) {
    BookingModel.find({}).populate('room').then(function (bs) {
        res.json(bs);
    }, function (err) { return next(err); });
};
/**
 * GET /bookings/:id
 * @param req
 * @param res
 * @param io
 */
exports.get_booking = function (req, res, next) {
    BookingModel.findById(req.params.id).then(function (b) {
        res.json(b);
    }, function (err) { return next(err); });
};
