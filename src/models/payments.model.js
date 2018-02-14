// payments-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const payments = new Schema({
        facilityId: { type: Schema.Types.ObjectId, required: false },
        personId: { type: Schema.Types.ObjectId, required: false },
        entity: { type: Schema.Types.String, required: true }, // Type of entity that is receiving payment.
        reference: { type: Schema.Types.Mixed, required: false }, // Reference from payment gateway.
        paidBy: { type: Schema.Types.ObjectId, required: true },
        amount: { type: Number, required: true }, // Amount paid at paystack's end.
        isActive: { type: Boolean, default: false }, // This will be set to true if payment is confirmed.
        paymentResponse: { type: Schema.Types.Mixed, required: false }, // This is the response from paystack if payment has been made.
        paymentType: { type: Schema.Types.String, required: true }, // This could either be e-payment, cash, cheque...
        paymentRoute: { type: Schema.Types.String, required: true }, // This could either be Flutterwave, cash, cheque...
        comment: { type: Schema.Types.String, required: false },
    }, {
            timestamps: true
        });

    return mongooseClient.model('payments', payments);
};