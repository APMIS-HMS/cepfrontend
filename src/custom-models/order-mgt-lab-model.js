const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderMgtLabSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  result: { type: Schema.Types.Mixed, required: false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = orderMgtLabSchema;