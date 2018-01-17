// externalPrescription-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const externalPrescription = new Schema({
    prescriptionId: { type: Schema.Types.ObjectId, required: true },
    patientId: { type: Schema.Types.ObjectId, required: false },
    facilityId: { type: Schema.Types.ObjectId, required: false },
    patientFullname: { type: String, required: false },
    generics: [{ type: String, required: true }],
    prescribeById: { type: Schema.Types.ObjectId, required: false },
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
  }, {
    timestamps: true
  });

  return mongooseClient.model('externalPrescription', externalPrescription);
};
