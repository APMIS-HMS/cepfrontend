const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const panelSchema = new Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
}); 
module.exports = panelSchema;