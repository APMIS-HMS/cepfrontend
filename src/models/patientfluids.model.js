// patientfluids-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const patientfluids = new Schema({
    fluid: { type: Schema.Types.Mixed, required: true },
    type: { type: String, required: true },
    volume: { type: Number, required: true },
    measurement: { type: String, required: true },
    patientId: { type: Schema.Types.ObjectId, required: true },
    facilityId: { type: Schema.Types.ObjectId, required: true }
  }, {
    timestamps: true
  });

  return mongooseClient.model('patientfluids', patientfluids);
};
