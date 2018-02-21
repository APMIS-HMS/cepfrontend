const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Track prescriptions items that has been dispensed.
const trackDispensedItemSchema = new Schema({
    orderIndex: { type: Number, required: false }, // unique
    dispensedDate: { type: Date, 'default': Date.now },
    batchNumber: { type: String, required: false },
    qty: { type: Number, required: false },
    employeeName: { type: String, required: false },
    storeName: { type: String, required: false },
    unitBilledPrice: { type: Number, required: false },
    totalAmount: { type: Number, required: false },
});
module.exports = trackDispensedItemSchema;