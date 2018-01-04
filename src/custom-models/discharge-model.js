const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dischargeSchema = new Schema({
  dischargeTypeId: { type: Schema.Types.Mixed, require: true },
  Reason: { type: String, require: false },
  isConfirmed: { type: Boolean, 'default': false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = dischargeSchema;