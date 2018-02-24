const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dischargeSchema = new Schema({
    dischargeType: { type: Schema.Types.Mixed, require: true },
    reason: { type: String, require: false },
    isConfirmed: { type: Boolean, 'default': false }
}, {
    timestamps: true
});
module.exports = dischargeSchema;