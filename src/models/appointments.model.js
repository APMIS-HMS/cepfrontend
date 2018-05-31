// appointments-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const attendanceModel = require('../custom-models/attendance');
const encounterModel = require('../custom-models/encounter');
const clinicInteractionModel = require('../custom-models/clinic-interaction');

module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const appointments = new Schema({
        facilityId: { type: Schema.Types.ObjectId, required: true },
        clinicId: { type: Schema.Types.String, required: true },
        appointmentTypeId: { type: Schema.Types.String, required: true },
        doctorId: { type: Schema.Types.ObjectId, required: false },
        orderStatusId: { type: Schema.Types.String, required: true },
        zoom: { type: Schema.Types.Mixed, required: false },
        startDate: { type: Date, require: true },
        patientId: { type: Schema.Types.ObjectId, required: true },
        appointmentReason: { type: String, require: false },
        category: { type: Schema.Types.String, required: true },
        checkedOut: { type: Schema.Types.Mixed, required: false },
        attendance: attendanceModel,
        encounters: [encounterModel],
        clinicInteractions: [clinicInteractionModel],
        isActive: { type: Boolean, 'default': true },
        isCheckedOut: { type: Boolean, 'default': false },
        isEngaged: { type: Boolean, 'default': false },
    }, {
        timestamps: true
    });

    return mongooseClient.model('appointments', appointments);
};