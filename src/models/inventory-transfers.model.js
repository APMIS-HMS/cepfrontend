// inventoryTransfers-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const inventorytransferTransactionSchema = require('../custom-models/inventory-transfer-transaction-model');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const inventoryTransfers = new Schema({
    facilityId: { type: Schema.Types.ObjectId, require: true, index: true },
    storeId: { type: Schema.Types.ObjectId, require: true },
    destinationStoreId: { type: Schema.Types.ObjectId, require: true },
    inventorytransactionTypeId: { type: Schema.Types.ObjectId, require: true },
    transferBy: { type: Schema.Types.ObjectId, require: true },
    inventoryTransferTransactions: [inventorytransferTransactionSchema],
    totalCostPrice: { type: Number }
  }, {
    timestamps: true
  });

  return mongooseClient.model('inventoryTransfers', inventoryTransfers);
};
