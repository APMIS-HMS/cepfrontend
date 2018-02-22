// purchaseEntries-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const itemOrdered = require('../custom-models/item-ordered-model');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const purchaseEntries = new Schema({
    facilityId: { type: Schema.Types.ObjectId, required: true },
    orderId: { type: Schema.Types.ObjectId, required: false },
    invoiceNumber: { type: String, required: false },
    amountPaid: { type: String, required: true },
    storeId: { type: Schema.Types.ObjectId, required: true },
    supplierId: { type: Schema.Types.ObjectId, required: false },
    createdBy: { type: Schema.Types.ObjectId, required: true },
    deliveryDate: { type: Date, required: false },
    remark: { type: String, required: false },
    products: [itemOrdered]
  }, {         
    timestamps: true
  });

  return mongooseClient.model('purchaseEntries', purchaseEntries);
};
