// facilityServiceRender-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const tagScheme = require('../custom-models/tag-model');


module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {
    Schema
  } = mongooseClient;
  const facilityServiceRender = new Schema({
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    priceModifier: [tagScheme],
    createdAt: {
      type: Date,
      'default': Date.now
    },
    updatedAt: {
      type: Date,
      'default': Date.now
    }
  }, {
    timestamps: true
  });

  return mongooseClient.model('facilityServiceRender', facilityServiceRender);
};
