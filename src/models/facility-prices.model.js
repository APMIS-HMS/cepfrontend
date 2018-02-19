// facilityPrices-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const modifierScheme = require('../custom-models/price-modifier-model');
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const facilityPrices = new Schema({
    facilityServiceId: { type: Schema.Types.ObjectId, require: true },
    categoryId: { type: Schema.Types.ObjectId, require: true },
    serviceId: { type: Schema.Types.ObjectId, require: true },
    facilityId:{ type: Schema.Types.ObjectId, require: true },
    modifiers :  [modifierScheme],
    price:{ type: Number, require: true }
  }, {
    timestamps: true
  });

  return mongooseClient.model('facilityPrices', facilityPrices);
};
