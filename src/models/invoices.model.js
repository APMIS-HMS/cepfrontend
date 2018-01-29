// invoices-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const invoices = new Schema({
    facilityId: { type: Schema.Types.ObjectId, require: true },
    patientId: { type: Schema.Types.ObjectId, require: false },
    walkInClientDetails: { type: Schema.Types.Mixed, required: false },
    isWalkIn: { type: Boolean, 'default': false },
    billingIds: [{ type: Schema.Types.Mixed, required: true }],
    payments: [{ type: Schema.Types.Mixed, required: true }],
    paymentStatus: { type: String,default: 'UNPAID' },
    paymentCompleted: { type: Schema.Types.Boolean, 'default': false },
    invoiceNo: { type: String, require: false },
    balance: { type: Number, require: false },
    totalDiscount: { type: Number, require: false },
    totalPrice: { type: Number, require: false },
    subTotal: { type: Number, require: false }
  }, {
    timestamps: true
  });

  return mongooseClient.model('invoices', invoices);
};
