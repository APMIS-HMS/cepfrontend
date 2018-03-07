const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billingSchema = new Schema({
    facilityServiceId: { type: Schema.Types.ObjectId, required: true },
    serviceId: { type: Schema.Types.ObjectId, required: true },
    facilityId: { type: Schema.Types.ObjectId, required: true },
    patientId: { type: Schema.Types.ObjectId, required: false },
    description: { type: String, required: false },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    isBearerConfirmed: { type: Schema.Types.Boolean, 'default': false },
    unitDiscountedAmount: { type: Number, required: false },
    totalDiscoutedAmount: { type: Number, required: false },
    waver: { type: Schema.Types.Mixed, required: false },
    payments: [{ type: Schema.Types.Mixed, required: false }], // payment method
    paymentStatus: [{ type: Schema.Types.Mixed, required: false }], // waved, insurance, partpayment, paid.
    paymentCompleted: { type: Schema.Types.Boolean, 'default': false },
    isServiceEnjoyed: { type: Schema.Types.Boolean, 'default': false },
    isInvoiceGenerated: { type: Schema.Types.Boolean, 'default': false },
    active: { type: Schema.Types.Boolean, 'default': true },
    covered: { type: Schema.Types.Mixed, required: false },
    modifierId: [{ type: Schema.Types.ObjectId, required: false }],
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }

});

module.exports = billingSchema;