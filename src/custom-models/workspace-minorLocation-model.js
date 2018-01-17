const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const minorLocSchema = new Schema({
    minorLocationId: { type: Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
})
module.exports = minorLocSchema;