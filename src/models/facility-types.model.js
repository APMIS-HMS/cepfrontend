// facilityTypes-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
//const facilityclassSchema = require('../custom-models/facilityclass.model');
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const facilityTypes = new Schema({
    name: { type: String, required: true },
    facilityClasses: { type: Schema.Types.Mixed, required: true }
  }, {
    timestamps: true
  });

  return mongooseClient.model('facilityTypes', facilityTypes);
};
