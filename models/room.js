var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    _id: Number,
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: Date.now },
    floor: { type: Number },
    displayname: String,
    isdeleted: { type: Boolean, default: false }
});
exports.Model = (mongoose.model('Room', schema));
