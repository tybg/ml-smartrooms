import mongoose = require('mongoose');
import baseschema = require('baseschema');
import bookingDbo = require('booking');
/**
 * Define the shape of the Room Schema in Mongoose
 */
export interface IRoomSchema extends baseschema.IBaseSchema {
    floor: Number;
    displayname: string;
    isdeleted: boolean;
    bookings: any[];
}

export class Room implements baseschema.MongooseSchemaBuilder<IRoomSchema> {
    static schema = new mongoose.Schema({
        _id: Number,
        created: { type: Date, default: Date.now },
        modified: { type: Date, default: Date.now },
        floor: { type: Number },
        displayname: String,
        isdeleted: { type: Boolean, default: false },
        bookings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        }]
    });

    static model: mongoose.Model<IRoomSchema> = <mongoose.Model<IRoomSchema>>(mongoose.model('Rooms', Room.schema));
}