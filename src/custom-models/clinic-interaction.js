'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const clinicinteractionSchema = new Schema({
  employee: { type: Schema.Types.Mixed, required: true },
  locationName: { type: String, required: false },
  title: { type: String, required: false },
  endAt: { type: Date },
  startAt: { type: Date },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});


module.exports = clinicinteractionSchema;