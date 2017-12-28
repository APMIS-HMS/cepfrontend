// facilities-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const toLower = require('../helpers/tolower');
const departmentSchema = require('../custom-models/department-model');
const walletSchema = require('../custom-models/wallet-model');
const locationSchema = require('../custom-models/minorlocation-model');
const inviteSchema = require('../custom-models/invitee-model');



module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const facilities = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, set: toLower },
    contactPhoneNo: { type: String, required: true },
    contactFullName: { type: String, required: true },
    departments: [departmentSchema],
    facilityOwnershipId: { type: Schema.Types.ObjectId, require: false },
    facilityTypeId: { type: Schema.Types.ObjectId, required: true },
    facilityClassId: { type: Schema.Types.ObjectId, required: false },
    logoObject: { type: Schema.Types.Mixed, required: false },
    facilitymoduleId: [{ type: Schema.Types.ObjectId, require: false }],
    address: { type: Schema.Types.Mixed, required: false },
    minorLocations: [locationSchema],
    wards:[{ type: Schema.Types.Mixed, required: false }],
    laboratories:[{ type: Schema.Types.Mixed, required: false }],
    clinics:[{ type: Schema.Types.Mixed, required: false }],
    pharmacies:[{ type: Schema.Types.Mixed, required: false }],
    theaters:[{ type: Schema.Types.Mixed, required: false }],
    imagingCenters:[{ type: Schema.Types.Mixed, required: false }],
    ownershipCentreId: { type: String, required: false },
    verificationToken: { type: String, required: false },
    isTokenVerified: { type: Boolean, 'default': false },
    website: { type: String, required: false },
    description: { type: String, required: false },
    invitees: [inviteSchema],
    wallet:  walletSchema,
    shortName: { type: String, required: false }
  }, {
    timestamps: true
  });

  return mongooseClient.model('facilities', facilities);
};
