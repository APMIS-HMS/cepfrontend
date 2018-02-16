const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clinicScheme = require('./clinic-model');
const unitSchema = new Schema({
    name: { type: String, required: false },
    shortName: { type: String, required: false },
    description: { type: String, required: false },
    isClinic: { type: Boolean, required: false },
    isActive: { type: Boolean, default: true },
    clinics: [clinicScheme],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = unitSchema;