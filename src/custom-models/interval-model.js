const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const intervalSchema = new Schema({
    unit: { type: String, required: true },
    sequence: { type: Number, required: false },
    duration: { type: Number, requred: true }
});

module.exports = intervalSchema;