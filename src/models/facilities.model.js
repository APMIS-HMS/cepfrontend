// facilities-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const toLower = require('../helpers/toLower');
const departmentSchema = require('../custom-models/department-model');
const walletSchema = require('../custom-models/wallet-model');
const locationSchema = require('../custom-models/minorlocation-model');
const inviteSchema = require('../custom-models/invitee-model');



module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const facilities = new Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, set: toLower },
        cacNo: { type: String, required: true },
        primaryContactPhoneNo: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        address: { type: Schema.Types.Mixed, required: false },
        shortName: { type: String, required: false },
        isNetworkFacility: { type: Boolean, 'default': false },
        isHostFacility: { type: Boolean, 'default': false },
        isHDO: { type: Boolean, 'default': true }, // HDO (Health Delivery Organization).
        memberFacilities: [{ type: Schema.Types.ObjectId, require: false }],
        memberof: [{ type: Schema.Types.ObjectId, require: false }],
        secondaryContactPhoneNo: [{ type: String, required: false }],
        departments: [departmentSchema],
        facilityOwnershipId: { type: String, require: false },
        facilityTypeId: { type: String, required: false },
        facilityClassId: { type: String, required: false },
        logoObject: { type: Schema.Types.Mixed, required: false },
        facilitymoduleId: [{ type: Schema.Types.Mixed, require: false }], //{isActive,moduleId}
        minorLocations: [locationSchema],
        ownershipCentreId: { type: String, required: false },
        verificationToken: { type: String, required: false },
        isTokenVerified: { type: Boolean, 'default': false },
        website: { type: String, required: false },
        status: { type: Boolean, 'default': false },
        isValidRegistration: { type: Boolean, 'default': false },
        description: { type: String, required: false },
        invitees: [inviteSchema],
        wallet: walletSchema
    }, {
        timestamps: true
    });

    return mongooseClient.model('facilities', facilities);
};