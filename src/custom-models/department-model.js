const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const unitSchema = require('./unit-model');

const departmentSchema = new Schema({
    name: { type: String, required: true },
    shortName: { type: String, required: false },
    description: { type: String, required: false },
    units: [unitSchema],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
module.exports = departmentSchema;