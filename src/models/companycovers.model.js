// companycovers-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const enrolleeSchema = require('../custom-models/company-enrollee-list-model');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const companycovers = new Schema({
    facilityId: { type: Schema.Types.Mixed, required: true },
    companyCovers: [enrolleeSchema]
  }, {
    timestamps: true
  });

  return mongooseClient.model('companycovers', companycovers);
};
