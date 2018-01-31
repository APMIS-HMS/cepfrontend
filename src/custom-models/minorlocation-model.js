const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const minorlocationSchema = new Schema({
  name: { type: String, required: true },
  locationId: { type: Schema.Types.ObjectId, required: true },
  setup: { type: Schema.Types.Mixed, required: false }
}, {
  timestamps: true
});
module.exports = minorlocationSchema;