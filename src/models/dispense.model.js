// dispense-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const prescriptionItem = require('../custom-models/dispensebyprescription');
const nonPrescriptionItem = require('../custom-models/dispensebynonprescriptn');

module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const dispense = new Schema({
        facilityId: { type: Schema.Types.ObjectId, required: true },
        prescription: prescriptionItem,
        nonPrescription: nonPrescriptionItem,
        isPrescription: { type: Boolean, 'default': false }
    }, {
        timestamps: true
    });

    return mongooseClient.model('dispense', dispense);
};