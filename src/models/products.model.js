// products-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const productDetailModel = require('../custom-models/product-detail-model');


module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const products = new Schema({
    facilityId: { type: Schema.Types.ObjectId, require: true },
    productApiId: { type: String, required: false },
    name: { type: String, required: true },
    genericName: { type: String, required: false },
    packSize: { type: Number, required: false },
    packLabel: { type: String, required: false },
    presentation: { type: String, required: false },
    variants:[{ type: Schema.Types.Mixed, required: false }],
    isInventory:{ type: Boolean, 'default': false },
    manufacturer: { type: String, require: true },
    productDetail: productDetailModel,
    productTypeId: { type: Schema.Types.ObjectId, require: true },
    categoryId: { type: Schema.Types.ObjectId, require: true },
    serviceId: { type: Schema.Types.ObjectId, require: true },
    facilityServiceId: { type: Schema.Types.ObjectId, require: true },
    isActive: { type: Boolean, 'default': true }
  }, {
    timestamps: true
  });

  return mongooseClient.model('products', products);
};
