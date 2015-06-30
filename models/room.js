var mongoose = require('mongoose');
var Room = (function () {
    function Room() {
    }
    Room.schema = new mongoose.Schema({
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
    Room.model = (mongoose.model('Rooms', Room.schema));
    return Room;
})();
exports.Room = Room;
