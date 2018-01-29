// countries-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const StateSchema = require('../custom-models/state-model');
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const countries = new Schema({
    name: { type: String, required: true },
    states: [StateSchema]
  }, {
    timestamps: true
  });

  return mongooseClient.model('countries', countries);
};
