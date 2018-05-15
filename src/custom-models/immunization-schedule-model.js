const vaccineSchema = require('./vaccine-model');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const immunizationScheduleSchema = new Schema({
    facilityId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    vaccines: [vaccineSchema],
    serviceId: { type: Schema.Types.ObjectId, required: true }
}, {
    timestamps: true
});


module.exports = immunizationScheduleSchema;