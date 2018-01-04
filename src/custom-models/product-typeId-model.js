const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productTypeIdSchema = new Schema({
  productTypeId : { type: String, required: false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = productTypeIdSchema;
