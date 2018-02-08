  // suppliers-model.js - A mongoose model
  // 
  // See http://mongoosejs.com/docs/models.html
  // for more of what you can do here.
  module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const suppliers = new Schema({
      name: { type: String, required: true },
      contact: { type: String, required: true },
      email: { type: String, required: false },
      address: { type: Schema.Types.Mixed, required: true },
      facilityId: { type: Schema.Types.ObjectId, require: true }
    }, {
      timestamps: true
    });

    return mongooseClient.model('suppliers', suppliers);
  };
