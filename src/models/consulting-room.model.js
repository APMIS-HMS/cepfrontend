// consultingRoom-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const roomModel = require('../../custom-models/consulting-room-item-model');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {
    Schema
  } = mongooseClient;
  const consultingRoom = new Schema({
    facilityId: {
      type: Schema.Types.ObjectId,
      require: true
    },
    rooms: [roomModel],
    majorLocationId: {
      type: Schema.Types.ObjectId,
      require: true
    },
    minorLocationId: {
      type: Schema.Types.ObjectId,
      require: true
    },
    createdAt: {
      type: Date,
      'default': Date.now
    },
    updatedAt: {
      type: Date,
      'default': Date.now
    }
  }, {
    timestamps: true
  });

  return mongooseClient.model('consultingRoom', consultingRoom);
};
