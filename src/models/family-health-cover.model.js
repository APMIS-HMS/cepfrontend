// familyHealthCover-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const dependantpersonIdSchema = require('../custom-models/dependantperson-model');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const familyHealthCover = new Schema({
    familyPrincipalPersonId: { type: Schema.Types.ObjectId, require: true },
    facilityId: { type: Schema.Types.ObjectId, require: true },
    dependents: [dependantpersonIdSchema],
    isActive: { type: Boolean, 'default': false },
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
  }, {
    timestamps: true
  });

  return mongooseClient.model('familyHealthCover', familyHealthCover);
};
