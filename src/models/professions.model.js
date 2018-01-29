// professions-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const cadarSchema = require('../custom-models/cader-model');
  const professions = new Schema({
    name: { type: String, required: true },
    caders: [cadarSchema],
  }, {
    timestamps: true
  });

  return mongooseClient.model('professions', professions);
};
