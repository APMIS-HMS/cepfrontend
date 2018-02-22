const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const serviceSchema = require('./service-model');

const categorySchema = new Schema({
    name: { type: String, required: true },
    categoryTypeId: { type: Schema.Types.ObjectId, require: false },
    description: { type: String, required: false },
    services: [serviceSchema],
    canRemove: { type: Boolean, default: true },
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
});
module.exports = categorySchema;