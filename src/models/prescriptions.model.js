// prescription-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const prescribe = require('../custom-models/prescription-item-model');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const prescription = new Schema({
    facilityId: { type: Schema.Types.ObjectId, required: true },
    employeeId: { type: Schema.Types.ObjectId, required: true },
    clinicId: { type: Schema.Types.ObjectId, required: true },
    patientId: { type: Schema.Types.ObjectId, required: true },
    prescriptionItems: [prescribe],
    priorityId: { type: Schema.Types.String, required: true }, //{ id, name }
    isAuthorised: { type: Boolean, 'default': false },
    isDispensed: { type: Boolean, 'default': false },
    isCosted: { type: Boolean, 'default': false },
    billId: { type: Schema.Types.ObjectId, required: false },
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
  }, {
    timestamps: true
  }); 

    return mongooseClient.model('prescription', prescription);
};