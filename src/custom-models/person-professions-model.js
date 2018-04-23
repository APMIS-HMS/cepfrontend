const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const dependantSchema = new Schema({
    name: { type: Schema.Types.String, required: true },
    associationId: { type: Schema.Types.ObjectId, required: false },
    professionalNo: { type: String, required: false },
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now },
});
module.exports = dependantSchema;