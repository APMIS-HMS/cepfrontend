const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bedOccupancyHistorySchema = new Schema({
    admittedDate: { type: Schema.Types.Date, required: true },
    dischargedDate: { type: Schema.Types.Date, default: Date.now },
    dischargedBy: { type: Schema.Types.ObjectId, required: true },
    admittedBy: { type: Schema.Types.ObjectId, required: true },
    patientId: { type: Schema.Types.ObjectId, required: true },
    dischargeType: { type: Schema.Types.String, required: true }
}, {
    timestamps: true
});
module.exports = bedOccupancyHistorySchema;