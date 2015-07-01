import IBase = require("IBase");
/**
 * Define the shape of the Booking Schema in Mongoose
 */
interface IBooking extends IBase {
    start: Date,
    end: Date,
    subject: string,
    details: string,
    isdeleted: boolean,
    room: any;
}

export = IBooking;