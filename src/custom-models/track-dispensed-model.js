const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dispensedItem = require('./track-dispensed-item-model');

// Track prescriptions that has been dispensed.
const trackDispensedSchema = new Schema({
  totalQtyDispensed: { type: Number, required: false },
  outstandingBalance: { type: Number, required: false },
  dispensedArray: [dispensedItem]
});
module.exports = trackDispensedSchema;