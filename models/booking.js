var mongoose = require('mongoose');
var schema = new mongoose.Schema({
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
exports.Model = (mongoose.model('Booking', schema));
