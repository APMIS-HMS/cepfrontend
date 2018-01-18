// corperateFacility-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const departmentSchema = require('../custom-models/department-model');
const imageSchema = require('../custom-models/image-model');
const addressSchema = require('../custom-models/address-model');
const bankItem = require('../custom-models/bank-detail-model');
const toLower = require('../helpers/toLower');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const corperateFacility = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, set: toLower },
    contactPhoneNo: { type: String, required: true },
    contactFullName: { type: String, required: true },
    contactPositionId: { type: Schema.Types.ObjectId, required: false },
    industryTypeId: { type: Schema.Types.ObjectId, required: false },
    hiaId: [{ type: Schema.Types.ObjectId, required: false }],
    hiaRegistrationDate: { type: Date, required: false },
    logo: { type: String, required: false },
    logoObject: imageSchema,
    isLshma: { type: Boolean, 'default': false },
    address: addressSchema,
    departments: [departmentSchema],
    bankDetails: bankItem,
    isLshmConfirm: { type: Boolean, 'default': false },
    verificationToken: { type: String, required: false },
    isTokenVerified: { type: Boolean, 'default': false },
    description: { type: String, required: false },
    cacNumber: { type: String, required: false },
    cinNumber: { type: String, required: false },
    website: { type: String, required: false },
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
  }, {
    timestamps: true
  });

  return mongooseClient.model('corperateFacility', corperateFacility);
};
