const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { type: String, required: true },
    size: { type: Number, require: false },
    isParentSize: { type: Boolean, default: true }
});
module.exports = categorySchema;