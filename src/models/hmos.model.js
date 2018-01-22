// hmos-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const enrolleeSchema = require('../custom-models/enrollee-list-model');
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const hmos = new Schema({
    facilityId: { type: Schema.Types.ObjectId, required: true },
    hmos: [enrolleeSchema],
  }, {
    timestamps: true
  });

  return mongooseClient.model('hmos', hmos);
};
