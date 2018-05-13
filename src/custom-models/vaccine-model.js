const intervalSchema = require('./interval-model');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 const vaccineSchema = new Schema({
    name: {type: String, required: true},
    codeName: {type: String, required: false},
    vaccinationSite: {type: String, required: true},
    doses: {type: String, required: true},
    serviceId: {type: Schema.Types.ObjectId, required: true},
    interval: [intervalSchema]
});

module.exports = vaccineSchema;