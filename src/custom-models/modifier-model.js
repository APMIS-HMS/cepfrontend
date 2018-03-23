const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modifierSchema = new Schema({
    modifierType: { type: String, required: true },
    amount: { type: String, required: false }
});
module.exports = modifierSchema;