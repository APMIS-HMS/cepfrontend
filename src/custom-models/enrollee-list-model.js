const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const enrolleeItemSchema = require('./enrollee-list-item-model');

const enrolleeListSchema = new Schema({
  hmo: { type: Schema.Types.ObjectId },
  enrolleeList: [enrolleeItemSchema],
  description: { type: String, required: false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = enrolleeListSchema;