const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentPlanSchema = new Schema({
  planType: { type: Schema.Types.String},
  isDefault: { type: Schema.Types.Boolean, default: false }
});
module.exports = paymentPlanSchema; 