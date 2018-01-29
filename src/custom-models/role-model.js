const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const featureSchema = require('./feature-model');

const facilityClassSchema = new Schema({
  facilityId : { type: Schema.Types.ObjectId, required: false },
  feature: featureSchema,
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = facilityClassSchema;