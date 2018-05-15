const vaccineSchema = require('./vaccine-model');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const immunizationScheduleSchema = new Schema({
    facilityId: {type: Schema.Types.ObjectId, required: true},
    name: {type: String, required: true},
    vaccine: [vaccineSchema],
    age: {type: Number, required: true},
    Date: {type: Date, 'default': Date.now},
    serviceId: {type: Schema.Types.ObjectId, required: true}
});

module.exports = immunizationScheduleSchema;
