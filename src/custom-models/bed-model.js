const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bedSchema = new Schema({
    name: { type: String, required: false },
}, {
    timestamps: true
});
module.exports = bedSchema;