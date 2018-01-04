const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  name: { type: String, required: false },
  strength: {type: Number, required: false},
  rxnormId:{type: Number, required: false},
  strengthUnit:{type: String, required: false}
});
module.exports = ingredientSchema;