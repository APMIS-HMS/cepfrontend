const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const unitSchema = new Schema({
  name: { type: String, required: true },
  shortName: { type: String, required: false },
  description: { type: String, required: false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = unitSchema;