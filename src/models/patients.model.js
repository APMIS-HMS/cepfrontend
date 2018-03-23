// patients-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const paymentPlanSchema = require('../custom-models/payment-plan-model');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const patients = new Schema({
    personId: { type: Schema.Types.ObjectId, required: true },
    facilityId: { type: Schema.Types.ObjectId, required: true },
    isActive: { type: Boolean, 'default': false },
    paymentPlan: [paymentPlanSchema],
    orders: [{ type: String, required: false }],
    tags: [{ type: Schema.Types.Mixed, required: false }],
    clientsNo: [{ type: Schema.Types.Mixed }],
    timeLines: [{ type: Schema.Types.Mixed, required: false }],
  }, {
    timestamps: true
  });

  return mongooseClient.model('patients', patients);
};
