const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const billingItem = require('./in-patient-bill-model');
const proposeItem = require('./proposeward-model');

const transferSchema = new Schema({
    minorLocationId: { type: Schema.Types.ObjectId, require: true },
    roomId: { type: Schema.Types.ObjectId, require: true },
    bedId: { type: Schema.Types.ObjectId, require: true },
    billing: [billingItem],
    description: { type: String, require: false },
    lastBillDate: { type: Date, required: false }, // Incase you want to bill the number of days stayed in the room.
    isBilled: { type: Boolean, default: false }, // Incase you want to bill the number of days stayed in the room.
    checkInDate: { type: Date, required: true, default: Date.now },
    checkOutDate: { type: Date, required: false },
    proposeWard: proposeItem,
}, {
    timestamps: true
});
module.exports = transferSchema;