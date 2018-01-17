const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const majorLocSchema = new Schema({
  majorLocationId: { type: Schema.Types.ObjectId, required: true },
  minorLocationId: { type: Schema.Types.ObjectId, required: true },
  isActive: { type: Schema.Types.Boolean, default: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = majorLocSchema;