const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientDocumentationSchema = new Schema({
  document: { type: Schema.Types.Mixed, required: true },
  createdBy: { type: Schema.Types.String, required: true },
  facilityId: { type: Schema.Types.ObjectId, required: true },
  facilityName:{ type: Schema.Types.String, required: true },
  patientId: { type: Schema.Types.ObjectId, required: true },
  patientName: { type: Schema.Types.String, required: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = patientDocumentationSchema;