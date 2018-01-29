const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dependantSchema = new Schema({
    dependantPersonId: { type: Schema.Types.ObjectId, required: false },
    relationshipId: { type: Schema.Types.ObjectId, required: false },
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
})
module.exports = dependantSchema;