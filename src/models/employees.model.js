// employees-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const employeeRole = require('../custom-models/employee-role-model');
const roomCheckInSchema = require('../custom-models/roomCheckin-model');
const storeCheckInSchema = require('../custom-models/storeCheckin-model');


module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const employees = new Schema({
    role: [employeeRole],
    facilityId: { type: Schema.Types.ObjectId, required: true },
    personId: { type: Schema.Types.ObjectId, ref: 'person', required: true },
    employeeIdNo: { type: String, required: false },
    departmentId: { type: Schema.Types.ObjectId, required: true },
    minorLocationId: { type: Schema.Types.ObjectId, required: true },
    primaryContactPhoneNo: { type: String, required: false },
    officialEmailAddress: { type: String, required: false },
    professionId: { type: Schema.Types.ObjectId, required: true },
    caderId: { type: Schema.Types.ObjectId, required: false },
    units: [{ type: Schema.Types.ObjectId, require: false }],
    consultingRoomCheckIn: [roomCheckInSchema],
    storeCheckIn: [storeCheckInSchema],
    workbenchCheckIn: [{ type: Schema.Types.Mixed, required: false }],
    wardCheckIn: [{ type: Schema.Types.Mixed, required: false }],
  }, {
    timestamps: true
  });

  return mongooseClient.model('employees', employees);
};
