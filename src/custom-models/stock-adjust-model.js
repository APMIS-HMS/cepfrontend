const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockAdjustSchema = new Schema({
  batchNumber: { type: String, required: false },
  systemQuantity: { type: Number, required: false },
  physicalQuantity: { type: Number, require: true },
  adjustBy: { type: Schema.Types.ObjectId, require: false },
  comment: { type: String, require: false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now },
});
module.exports = stockAdjustSchema;