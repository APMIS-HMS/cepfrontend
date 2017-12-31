// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const roleSchema = require('../custom-models/role-model');

  const users = new mongooseClient.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    personId: { type: Schema.Types.ObjectId, required: true },
    passwordToken: { type: String, required: false },
    isTokenVerified: { type: Boolean, 'default': false },
    facilitiesRole: [roleSchema],

  }, {
    timestamps: true
  });

  return mongooseClient.model('users', users);
};
