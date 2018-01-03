// organisationServices-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const categoryScheme = require('../custom-models/category-model');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const organisationServices = new Schema({
    facilityId: { type: Schema.Types.ObjectId, require: false },
    categories: [categoryScheme]
  }, {
    timestamps: true
  });

  return mongooseClient.model('organisationServices', organisationServices);
};
