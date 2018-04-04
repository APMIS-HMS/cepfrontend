// product-reorder-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const productReorder = new Schema({
    facilityId: { type: Schema.Types.ObjectId, require: true },
    productId: { type: Schema.Types.ObjectId, require: true },
    storeId: { type: Schema.Types.ObjectId, require: true },
    reOrderLevel: { type: Number, require: true },
    reOrderSizeId: { type: Schema.Types.ObjectId, require: true },
  }, {
    timestamps: true
  });

  return mongooseClient.model('productReorder', productReorder);
};
