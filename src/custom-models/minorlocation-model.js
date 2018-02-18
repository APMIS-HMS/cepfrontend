const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const wardSetupSchema = require('./ward-setup-model.js');

const minorlocationSchema = new Schema({
    name: { type: String, required: true },
    locationId: { type: Schema.Types.ObjectId, required: true },
    isActive: { type: Boolean, default: true },
    setup: { type: Schema.Types.Mixed, required: false },
    wardSetup: wardSetupSchema,
    description: { type: String, required: false },
}, {
    timestamps: true
});
module.exports = minorlocationSchema;