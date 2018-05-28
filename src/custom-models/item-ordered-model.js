const qtyDetails = require('../custom-models/qty-details-model');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true },
  qtyDetails: [qtyDetails],
  costPrice: { type: Number, required: false },
  expiryDate: { type: Date, required: false },
  batchNo: { type: String, required: false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = orderSchema;