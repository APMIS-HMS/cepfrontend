const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentPlanSchema = new Schema({
  planType: { type: Schema.Types.String},
  bearerPersonId:{ type: Schema.Types.ObjectId, required: false },
  planDetails:{type: Schema.Types.Mixed, default: false},
  isDefault: { type: Schema.Types.Boolean, default: false }
});
module.exports = paymentPlanSchema; 