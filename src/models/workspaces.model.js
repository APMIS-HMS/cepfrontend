// workspaces-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const locations = require('../custom-models/workspace-majorLocation-model');
  const { Schema } = mongooseClient;
  const workspaces = new Schema({
    facilityId: { type: Schema.Types.ObjectId, required: true },
    employeeId: { type: Schema.Types.ObjectId, required: true },
    locations: [locations],
    isActive: { type: Schema.Types.Boolean, default: true },
  }, {
    timestamps: true
  });

  return mongooseClient.model('workspaces', workspaces);
};
