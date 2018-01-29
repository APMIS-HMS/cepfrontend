const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dispenseItem = require('./dispense-item');

const prescribeSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    required: false
  },
  client: {
    type: Schema.Types.Mixed,
    required: false
  }, // { clientType, name, phone, }
  employee: {
    type: Schema.Types.Mixed,
    required: false
  }, // { employeeId, employeeName };
  drugs: [dispenseItem],
  totalQuantity: {
    type: Number,
    required: false
  },
  totalCost: {
    type: Number,
    required: false
  }
});
module.exports = prescribeSchema;
