var mongoose = require('mongoose');
var Booking = (function () {
    function Booking() {
    }
    Booking.schema = new mongoose.Schema({
        created: { type: Date, default: Date.now },
        modified: { type: Date, default: Date.now },
        start: { type: Date },
        end: { type: Date },
        subject: String,
        details: String,
        isdeleted: { type: Boolean, default: false },
        room: {
            type: Number,
            ref: 'Room'
        }
    });
    Booking.model = (mongoose.model('Booking', Booking.schema));
    return Booking;
})();
exports.Booking = Booking;
