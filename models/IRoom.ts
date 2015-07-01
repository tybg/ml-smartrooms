/**
 * Define the shape of the Room Schema in Mongoose
 */
import IBase = require("IBase");

interface IRoom extends IBase {
    floor: Number;
    displayname: string;
    isdeleted: boolean;
    //bookings: any[];
}

export = IRoom;