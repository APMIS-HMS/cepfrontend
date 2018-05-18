const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const immuneAppointmentSchema = new Schema({
    date: { type: Date, 'default': Date.now, required: true },
    status: { type: String, 'default': 'valid', required: true }, // This could either be valid or notValid
    //isDue: { type: Boolean, 'default': false, required: false },
    isPast: { type: Boolean, 'default': false, required: false },
    isFuture: { type: Boolean, 'default': true, required: false },
    completed:{type:Boolean, 'default':false, required:false},
    appointmentId:{type: Object}
}, {
    timestamps: true
});

module.exports = immuneAppointmentSchema;