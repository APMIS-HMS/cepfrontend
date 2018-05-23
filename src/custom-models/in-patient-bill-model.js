const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inPatientBillSchema = new Schema({
    lastBillDate: { type: Date, required: true },
    day: { type: Date, required: true },
    amount:{ type: Number, required: true },
    totalAmount:{ type: Number, required: true },
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
});
module.exports = inPatientBillSchema;