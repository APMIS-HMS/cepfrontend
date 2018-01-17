// companycovers-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const enrolleeSchema = require('../../custom-models/enrollee-list-model');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const companycovers = new Schema({
    facilityId: { type: Schema.Types.Mixed, required: true },
    companyCovers: [enrolleeSchema],
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
  }, {
    timestamps: true
  });

  return mongooseClient.model('companycovers', companycovers);
};
