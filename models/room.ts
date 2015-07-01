import mongoose = require('mongoose');
import IRoom = require("IRoom");

export interface IRoomModel extends IRoom, mongoose.Document { }

var schema = new mongoose.Schema({
    _id: Number,
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
    floor: { type: Number },
    displayname: String,
    isdeleted: { type: Boolean, default: false }
    /*bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }]*/
});

export var Model: mongoose.Model<IRoomModel> = <mongoose.Model<IRoomModel>>(mongoose.model('Room', schema));