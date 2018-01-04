const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventoryTransferTransactionSchema = new Schema({
  inventoryId: { type: Schema.Types.ObjectId, require: true },
  transactionId: { type: Schema.Types.ObjectId, require: true },
  productId: { type: Schema.Types.ObjectId, require: true },
  quantity: { type: Number, required: false },
  costPrice: { type: Number, required: false },
  lineCostPrice: { type: Number, required: false },
  transferStatusId: { type: Schema.Types.ObjectId, require: true },
  receivedBy: { type: Schema.Types.ObjectId, require: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = inventoryTransferTransactionSchema;