// inPatients-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const wardTransfer = require('../custom-models/ward-transfer-model');
const dischargeTransfer = require('../custom-models/discharge-model');

module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const inPatients = new Schema({
        facilityId: { type: Schema.Types.ObjectId, require: true },
        patientId: { type: Schema.Types.ObjectId, require: true },
        transfers: [wardTransfer],
        status: { type: String, require: false },
        admissionDate: { type: Date, default: Date.now },
        admittedBy: { type: Schema.Types.ObjectId, require: true },
        transferredBy: { type: Schema.Types.ObjectId, require: false },
        prevWard: { type: Schema.Types.ObjectId, require: false },
        currentWard: { type: Schema.Types.ObjectId, require: false },
        discharge: dischargeTransfer,
        dischargedBy: { type: Schema.Types.ObjectId, required: false },
        proposedWard: { type: Schema.Types.ObjectId, required: false },
        isDischarged: { type: Boolean, default: false }
    }, {
        timestamps: true
    });

    return mongooseClient.model('inPatients', inPatients);
};