const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { type: String, required: true },
    size: { type: Number, require: false },
    packId: { type: Schema.Types.ObjectId, require: true },
    isBase: { type: Boolean, default: false }
});
module.exports = categorySchema;