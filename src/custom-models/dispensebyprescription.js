const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const dispenseItem = require('../custom-models/dispense-item');

const prescribeSchema = new Schema({
  prescriptionId: { type: Schema.Types.ObjectId, required: true },
  employeeId: { type: Schema.Types.ObjectId, required: true },
  patientId: { type: Schema.Types.ObjectId, required: true },
//   drugs: [dispenseItem],
  totalQuantity: { type: Number, required: false },
  totalCost: { type: Number, required: false },
  isDispensed: { type: Boolean, 'default': false },
});
module.exports = prescribeSchema;