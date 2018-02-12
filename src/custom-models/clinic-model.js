const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clinicSchema = new Schema({
   clinicName: { type: String, required: false },
   clinicCapacity: {type: Number, 'default': 0},
   createdAt: { type: Date, 'default': Date.now },
   updatedAt: { type: Date, 'default': Date.now }
})
module.exports = clinicSchema;