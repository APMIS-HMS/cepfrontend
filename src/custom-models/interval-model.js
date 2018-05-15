const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const intervalSchema = new Schema({
    unit: {type: Number, required: true},
    duration: {type: String, requred: true}
});

module.exports = intervalSchema;