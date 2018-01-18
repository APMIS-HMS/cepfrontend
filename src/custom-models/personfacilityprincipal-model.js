const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dependantpersonIdSchema = require('./dependantperson-model');


const dependantSchema = new Schema({
  personId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  departmentId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  dependants: [dependantpersonIdSchema],
  createdAt: {
    type: Date,
    'default': Date.now
  },
  updatedAt: {
    type: Date,
    'default': Date.now
  },
});
module.exports = dependantSchema;
