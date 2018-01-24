const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrolleeListSchema = new Schema({
  filNo: {type:String, required: true},
  firstname: {type:String, required: false},
  surname:{ type:String, required: true},
  othernames: { type: String, required: true },
  address:{ type:String, required: false},
  email: { type: String, required: false },
  phone:{ type:String, required: false},
  status: { type: String, required: true },
  gender:{ type:String, required: false},
  patientId: {type: String, required: false},
  serial: { type: Number, required: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = enrolleeListSchema;