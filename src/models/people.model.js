// people-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const walletSchema = require('../custom-models/wallet-model');
const personProfessionsSchema = require('../custom-models/person-professions-model');

module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const people = new Schema({
        apmisId: { type: String, required: true },
        title: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        gender: { type: String, required: true },
        motherMaidenName: { type: String, required: true },
        securityQuestion: { type: String, required: false },
        securityAnswer: { type: String, required: false },
        primaryContactPhoneNo: { type: String, required: true },
        secondaryContactPhoneNo: [{ type: String, required: false }],
        dateOfBirth: { type: Date, require: false },
        email: { type: String, required: false },
        otherNames: { type: String, required: false },
        bloodGroup: { type: String, required: false },
        genotype: { type: String, required: false },
        biometric: { type: Buffer, required: false },
        personProfessions: [personProfessionsSchema],
        nationality: { type: String, required: false },
        stateOfOrigin: { type: String, required: false },
        lgaOfOrigin: { type: String, required: false },
        profileImageObject: { type: Schema.Types.Mixed, required: false },
        homeAddress: { type: Schema.Types.Mixed, required: false },
        maritalStatus: { type: Schema.Types.String, required: false },
        nextOfKin: [{ type: Schema.Types.Mixed, required: false }],
        wallet: walletSchema
    }, {
        timestamps: true
    });

    return mongooseClient.model('people', people);
};