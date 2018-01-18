// family-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const enrolleeSchema = require('../custom-models/enrollee-family-list-model');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const family = new Schema({
    facilityId: { type: Schema.Types.ObjectId, required: true },
    familyCovers: [enrolleeSchema],
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
  }, {
    timestamps: true
  });

  return mongooseClient.model('family', family);
};
