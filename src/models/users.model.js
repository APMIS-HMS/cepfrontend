// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const {
        Schema
    } = mongooseClient;
    const userRoleSchema = require('../custom-models/user-role-model');

    const users = new mongooseClient.Schema({
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        personId: { type: Schema.Types.ObjectId, required: true },
        userRoles: [userRoleSchema],
        verificationToken: { type: String, required: false },
        isTokenVerified: { type: Boolean, 'default': false },
        facilitiesRole: [{ type: Schema.Types.Mixed }]
    },
    {
        timestamps: true
    });

    return mongooseClient.model('users', users);
};
