// immunizationRecordHistory-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const vaccineSchema = require('../custom-models/vaccine-model');
const immuneAppointment = require('../custom-models/appointmentSchedule-model');

module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const immunizationRecordHistory = new Schema({
        facilityId: {type: Schema.Types.ObjectId, required: true},
        patientId: {type: Schema.Types.ObjectId, required: true},
        immunizations: [{
            immunizationScheduleId: {type: Schema.Types.ObjectId, required: true},
            immunizationName: { type: String, required: true },
            vaccines: [{
                vaccine: vaccineSchema,
                appointment: [immuneAppointment],
                completed: { type: Boolean, 'default': false, required: false } // This shows the status of the vaccine sequence
            }],
            completed: { type: Boolean, 'default': false, required: false },// This shows the immunization status 
        }],
        completed: { type: Boolean, 'default': false, required: false } // This shows the status of the entire process
    },  {
        timestamps: true
    });

    return mongooseClient.model('immunizationRecordHistory', immunizationRecordHistory);
};
