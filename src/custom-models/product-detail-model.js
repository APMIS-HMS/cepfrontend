const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productIngredient = require('./product-ingredient-model');

const productDetailSchema = new Schema({
  publishedVer: { type: String, required: false },
  drugName: { type: String, required: false },
  drugId: { type: String, required: false },
  productName: { type: String, required: false },
  productId: { type: String, required: false },
  brand: { type: String, required: false },
  company: { type: String, required: false },
  form: { type: String, required: false },
  route: { type: String, required: false },
  generic: { type: String, required: false },
  otc: { type: String, required: false },
  ingredients: [productIngredient],
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});
module.exports = productDetailSchema;
