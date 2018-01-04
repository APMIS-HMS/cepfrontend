// inPatients-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const wardTransfer = require('../custom-models/ward-transfer-model');
const dischargeTransfer = require('../custom-models/discharge-model');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const inPatients = new Schema({
    facilityId: { type: Schema.Types.Mixed, require: true },
    patientId: { type: Schema.Types.Mixed, require: true },
    transfers: [wardTransfer],
    statusId: { type: String, require: false },
    admissionDate: { type: Date, require: true },
    admitByEmployeeId: { type: Schema.Types.Mixed, require: true },
    prevWard: { type: Schema.Types.Mixed, require: false },
    currentWard: { type: Schema.Types.Mixed, require: false },
    discharge: dischargeTransfer,
    proposeWard: { type: Schema.Types.Mixed, required: false },
    isDischarged: { type: Boolean, default: false }
  }, {
    timestamps: true
  });

  return mongooseClient.model('inPatients', inPatients);
};
