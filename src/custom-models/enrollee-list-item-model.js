const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrolleeListSchema = new Schema({
  month: { type: Schema.Types.Number},
  year: { type: Schema.Types.Number },
  enrollees: [{ type: Schema.Types.Mixed}],
  description: { type: String, required: false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = enrolleeListSchema;