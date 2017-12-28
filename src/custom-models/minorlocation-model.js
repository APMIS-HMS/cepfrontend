const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const minorlocationSchema = new Schema({
  name: { type: String, required: true },
  shortName:{ type: String, required: true },
  description:{ type: String, required: false },
  locationId:{type: Schema.Types.ObjectId,require:true},
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = minorlocationSchema;