const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    street: { type: String, required: true },
    city: { type: Schema.Types.ObjectId, required: false },
    lga: { type: Schema.Types.ObjectId, required: false },
    state: { type: Schema.Types.ObjectId, required: false },
    country: { type: Schema.Types.ObjectId, required: false },
    landmark: { type: String, required: false },
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now },
});
module.exports = addressSchema;