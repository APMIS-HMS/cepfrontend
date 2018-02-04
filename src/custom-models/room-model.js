const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bed = require('./bed-model.js');

const roomSchema = new Schema({
    name: { type: String, required: false },
    group: { type: Schema.Types.Mixed, required: false },
    facilityServiceId: { type: Schema.Types.ObjectId, required: false },
    service: { type: Schema.Types.Mixed, required: false },
    categoryId: { type: Schema.Types.ObjectId, required: false },
    beds: [bed],
    description: { type: String, required: false },
}, {
    timestamps: true
});
module.exports = roomSchema;