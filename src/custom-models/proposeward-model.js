const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const proposedSchema = new Schema({
  minorLocationId: { type: Schema.Types.ObjectId, require: false },
  isAccepted: { type: Boolean, 'default': false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = proposedSchema;