var bookingDbo = require('../models/booking');
var Booking = bookingDbo.Booking.model;
/**
 * GET /bookings
 * @param req
 * @param res
 * @returns {}
 */
exports.get_bookings = function (req, res) {
    Booking.find({}, function (err, docs) {
        if (err)
            throw err;
        res.json(docs);
    });
};
/**
 * GET /bookings/:id
 * @param req
 * @param res
 * @param io
 */
exports.get_booking = function (req, res, next) {
    Booking.findById(req.params.id).then(function (bs) {
        res.json(bs);
    }, function (err) { return next(err); });
};
