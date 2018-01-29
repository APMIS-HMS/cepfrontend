const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const consultingRoomItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    'default': Date.now
  },
  updatedAt: {
    type: Date,
    'default': Date.now
  }
});
module.exports = consultingRoomItemSchema;
