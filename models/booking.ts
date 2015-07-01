import mongoose = require('mongoose');
import IBooking = require("IBooking");

export interface IBookingModel extends IBooking, mongoose.Document { }

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

export var Model: mongoose.Model<IBookingModel> = <mongoose.Model<IBookingModel>>(mongoose.model('Booking', schema));