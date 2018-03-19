// product-configs-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const packageItem = require('../custom-models/packageItem-model');
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const productConfigs = new Schema({
    facilityId: { type: Schema.Types.ObjectId, require: true },
    productId: { type: Schema.Types.ObjectId, require: true },
    packSizes:[packageItem]
  }, {
    timestamps: true
  });

  return mongooseClient.model('productConfigs', productConfigs);
};
