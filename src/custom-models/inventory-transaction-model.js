const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adjustStockSchema = require('./stock-adjust-model');
const batchTransactionSchema = require('./batch-transaction-model');

const inventoryTransactionSchema = new Schema({
  batchNumber: { type: String, required: false },
  productionDate: { type: Date, required: false },
  expiryDate: { type: Date, required: false },
  costPrice: { type: Number, required: false },
  quantity: { type: Number, require: true },
  availableQuantity: { type: Number, require: true },
  strengthId: { type: Schema.Types.ObjectId, require: false },
  purchaseEntryId: { type: Schema.Types.ObjectId, require: false },
  purchaseEntryDetailId: { type: Schema.Types.ObjectId, require: false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now },
  batchTransactions: [batchTransactionSchema], // Transactions at the batch level.
  inventorytransactionTypeId: { type: Schema.Types.ObjectId, require: false }, // in, out
  adjustStocks: [adjustStockSchema] // if there are differencies between what you have in shelve and system.
});
module.exports = inventoryTransactionSchema;
