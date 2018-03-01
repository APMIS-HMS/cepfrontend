const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeCheckInSchema = new Schema({
    minorLocationId: { type: Schema.Types.ObjectId, required: true },
    storeId: { type: Schema.Types.ObjectId, required: true },
    storeObject: { type: Schema.Types.Mixed, required: true },
    isDefault: { type: Schema.Types.Boolean, default: false },
    isOn: { type: Schema.Types.Boolean, default: false },
    lastLogin: { type: Date, 'default': Date.now }
});
module.exports = storeCheckInSchema;