const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  packId: { type: Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = orderSchema;