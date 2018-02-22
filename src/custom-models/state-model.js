const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LGSchema = require('./lg-model');
const citySchema = require('./city-model');

const stateSchema = new Schema({
    name: { type: String, required: true },
    lgs: [LGSchema],
    cities: [citySchema],
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
});
module.exports = stateSchema;