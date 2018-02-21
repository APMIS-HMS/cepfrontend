const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRoleSchema = new Schema({
    facilityId: { type: Schema.Types.ObjectId, required: true },
    roles: [{ type: Schema.Types.ObjectId, required: true }]
}, {
    timestamps: true
});
module.exports = userRoleSchema;