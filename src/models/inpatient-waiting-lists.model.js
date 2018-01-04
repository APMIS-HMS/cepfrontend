// inpatientWaitingLists-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const inpatientWaitingLists = new Schema({
    employeeId: { type: Schema.Types.Mixed, required: true },
    patientId: { type: Schema.Types.Mixed, required: true },
    clinicId: { type: Schema.Types.Mixed, required: false },
    facilityId: { type: Schema.Types.Mixed, required: true },
    wardId: { type: Schema.Types.Mixed, required: true },
    unitId: { type: Schema.Types.Mixed, required: false },
    isAdmitted: { type: Boolean, 'default': false },
    admittedDate: { type: Date, required: false },
    description: { type: String, required: false }
  }, {
    timestamps: true
  });

  return mongooseClient.model('inpatientWaitingLists', inpatientWaitingLists);
};
