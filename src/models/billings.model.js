// billings-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const billingItemScheme = require('../custom-models/billing-item-model');


module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const billings = new Schema({
        facilityId: { type: Schema.Types.ObjectId, required: true },
        coverFile: { type: Schema.Types.Mixed, required: false },
        patientId: { type: Schema.Types.ObjectId, required: false },
        walkInClientDetails: { type: Schema.Types.Mixed, required: false }, // { "name": "", "phone": ""}
        isWalkIn: { type: Boolean, 'default': false },
        userId: { type: Schema.Types.ObjectId, required: false },
        billItems: [billingItemScheme],
        subTotal: { type: Number, required: true },
        grandTotal: { type: Number, required: true },
        discount: { type: Number, required: false }
    }, {
        timestamps: true
    });

    return mongooseClient.model('billings', billings);
};