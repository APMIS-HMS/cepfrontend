const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const encounterSchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, required: true },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = encounterSchema;