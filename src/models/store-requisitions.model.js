// storeRequisitions-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const product = require('../custom-models/product-requisition-model');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const storeRequisitions = new Schema({
    facilityId: { type: Schema.Types.ObjectId, require: true },
    employeeId: { type: Schema.Types.ObjectId, require: true },
    storeId: { type: Schema.Types.ObjectId, require: true },
    products: [product],
    comment: { type: String, required: false },
    storeRequisitionNumber: { type: String, required: true }
  }, {
    timestamps: true
  });

  return mongooseClient.model('storeRequisitions', storeRequisitions);
};
