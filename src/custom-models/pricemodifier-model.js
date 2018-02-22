const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const servicemodifierSchema = new Schema({
  tagId: { type: Schema.Types.ObjectId, required: true },
  modifierType: { type: String, required: true },
  modifierValue: { type: Number, required: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = servicemodifierSchema;