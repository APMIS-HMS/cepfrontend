const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  employeeId: { type: Schema.Types.Mixed, required: true },
  majorLocationId: { type: Schema.Types.ObjectId, required: true },
  minorLocationId: { type: Schema.Types.ObjectId, required: true },
  dateCheckIn: { type: Date, required: true },
  dateCheckOut: { type: Date, required: false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now },
});
module.exports = attendanceSchema;