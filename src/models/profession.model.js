// profession-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const cadarSchema = require('../custom-models/cader-model');


module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const profession = new Schema({
    name: { type: String, required: true },
    caders: [cadarSchema],
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
  }, {
    timestamps: true
  });

  return mongooseClient.model('profession', profession);
};
