const intervalSchema = require('./interval-model');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vaccineSchema = new Schema({
    name: { type: String, required: true },
    nameCode: { type: String, required: true },
    code: { type: String, required: true },
    vaccinationSite: { type: String, required: true },
    numberOfDosage: { type: Number, required: true },
    dosage: { type: String, required: true },
    serviceId: { type: Schema.Types.ObjectId, required: true },
    intervals: [intervalSchema]
});

module.exports = vaccineSchema;