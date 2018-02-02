const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleItemSchema = new Schema({
  day: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  location: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = scheduleItemSchema;