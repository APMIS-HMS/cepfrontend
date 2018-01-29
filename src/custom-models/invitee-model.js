const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inviteeSchema = new Schema({
  companyName: { type: String, required: true },
  contactFirtName: { type: String, required: true },
  contactLastName: { type: String, required: true },
  companyEmail: { type: String, required: true },
  contactPhoneNumber: { type: String, required: true },
  isRegistered: { type: Boolean, 'default': false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = inviteeSchema;