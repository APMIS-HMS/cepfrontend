// employees-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const employeeRole = require('../custom-models/employeerole-model');
const roomCheckInSchema = require('../custom-models/room-check-in');
const storeCheckInSchema = require('../custom-models/store-check-in');


module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const employees = new Schema({
    role: [employeeRole],
    facilityId: { type: Schema.Types.ObjectId, required: true },
    personId: { type: Schema.Types.ObjectId, ref: 'person', required: true },
    employeeIdNo: { type: String, required: false },
    departmentId: { type: String, required: true },
    minorLocationId: { type: String, required: true },
    primaryContactPhoneNo: { type: String, required: false },
    officialEmailAddress: { type: String, required: false },
    professionId: { type: String, required: true },
    caderId: { type: String, required: false },
    isActive: { type: Boolean, 'default': true },
    units: [{ type: String, require: false }],
    consultingRoomCheckIn: [roomCheckInSchema],
    storeCheckIn: [storeCheckInSchema],
    workbenchCheckIn: [{ type: Schema.Types.Mixed, required: false }],
    wardCheckIn: [{ type: Schema.Types.Mixed, required: false }],
  }, {
    timestamps: true
  });

  return mongooseClient.model('employees', employees);
};
