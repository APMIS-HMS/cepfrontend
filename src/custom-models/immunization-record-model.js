const vaccineSchema = require('./vaccine-model');

module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const immuneAppointment = new Schema({
        date: { type: Date, 'default': Date.now, required: true },
        status: { type: String, 'default': 'valid', required: true }, // This could either be valid or notValid
        isDue: { type: Boolean, 'default': false, required: false },
        isPast: { type: Boolean, 'default': false, required: false },
        isFuture: { type: Boolean, 'default': true, required: false },
        completed:{type:Boolean, 'default':false, required:false},
        appointmentId:{type: Object}
    }, {
        timestamps: true
    });

    const immunizationRecord = new Schema({
        facilityId: { type: Schema.Type.ObjectId, required: true },
        patientId: { type: Schema.Type.ObjectId, required: true },
        immunizations: [{
            immunizationScheduleId: { type: Schema.Type.ObjectId, required: true },
            immunizationName: { type: String, required: true },
            vaccines: [{
                vaccine: vaccineSchema,
                appointment: [immuneAppointment],
                completed:{ type: Boolean,'default':false, required: false }, // This shows the status of the vaccine sequence
            }],
            completed:{ type: Boolean,'default':false, required: false },// This shows the immunization status 
        }],
        completed: { type: Boolean,'default':false, required: false } // This shows the status of the entire process
    }, {
        timestamps: true
    });

    return mongooseClient.model('immunizationRecord', immunizationRecord);
};