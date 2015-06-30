import mongoose = require('mongoose');
import baseschema = require('baseschema');
import room = require('room');
/**
 * Define the shape of the Booking Schema in Mongoose
 */
export interface IBookingSchema extends baseschema.IBaseSchema {
    start: Date,
    end: Date,
    subject: string,
    details: string,
    isdeleted: boolean,
    room: any;
}

export class Booking implements baseschema.MongooseSchemaBuilder<IBookingSchema> {
    static schema = new mongoose.Schema({
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

    static model: mongoose.Model<IBookingSchema> = <mongoose.Model<IBookingSchema>>(mongoose.model('Booking', Booking.schema));
}