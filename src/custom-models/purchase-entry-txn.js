const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const txSchema = new Schema({
  paidBy: { type: Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  paymentChannel: { type: String, required: false },
  cheque: { type: String, required: false },
  transactionNumber: { type: String, required: false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = txSchema;