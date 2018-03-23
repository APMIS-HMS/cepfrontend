const mongoose = require('mongoose');
const modifierScheme = require('./modifier-model');
const Schema = mongoose.Schema;


const tagSchema = new Schema({
    name: { type: String, required: true },
    modifier: modifierScheme,
    facilityId: { type: Schema.Types.ObjectId, required: false },
    description: { type: String, required: false },
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
});
module.exports = tagSchema;