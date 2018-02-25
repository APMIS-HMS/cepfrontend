const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const batchTransactionSchema = new Schema({
  batchNumber: { type: String, required: true },
  employeeId: { type: Schema.Types.ObjectId, required: true },
  preQuantity: { type: Number, required: true }, // Before Operation.
  postQuantity: { type: Number, required: true }, // After Operation.
  quantity: { type: Number, require: true }, // Operational qty.
  comment: { type: String, require: false },
  referenceId: { type: String, required: false }, // Dispense id, Transfer id...
  referenceService: { type: String, required: false }, // Dispense, Transfer...
  inventorytransactionTypeId: { type: Schema.Types.ObjectId, require: false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now },
});
module.exports = batchTransactionSchema;