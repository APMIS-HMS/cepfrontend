const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roomSchema = require('./room-model.js');

const minorlocationSchema = new Schema({
    minorLocationId: { type: Schema.Types.ObjectId, required: false },
    rooms: [roomSchema]
}, {
    timestamps: true
});
module.exports = minorlocationSchema;