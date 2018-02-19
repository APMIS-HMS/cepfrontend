// const panel = require('./panel-model.js');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: false },
  panels:[{ type: Schema.Types.Mixed, required: false }],
  description: { type: String, required: false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = serviceSchema;