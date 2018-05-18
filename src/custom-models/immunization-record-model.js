const vaccineSchema = require('./vaccine-model');
const immuneAppointment = require('./appointmentSchedule-model');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const immunizationRecordSchema = new Schema({
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
}, {
    timestamps: true
});

module.exports = immunizationRecordSchema;