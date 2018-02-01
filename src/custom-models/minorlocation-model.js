const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const minorlocationSchema = new Schema({
  name: { type: String, required: true },
  locationId: { type: Schema.Types.ObjectId, required: true },
  setup: { type: Schema.Types.Mixed, required: false },
  description: { type: String, required: true },
}, {
  timestamps: true
});
module.exports = minorlocationSchema;