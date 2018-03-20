  // suppliers-model.js - A mongoose model
  //
  // See http://mongoosejs.com/docs/models.html
  // for more of what you can do here.
  module.exports = function(app) {
      const mongooseClient = app.get('mongooseClient');
      const { Schema } = mongooseClient;
      const suppliers = new Schema({
          facilityId: { type: Schema.Types.ObjectId, required: true },
          supplierId: { type: Schema.Types.ObjectId, required: true },
          createdBy: { type: Schema.Types.ObjectId, required: true },
          isActive: { type: Schema.Types.Boolean, default: true }
          // name: { type: String, required: true },
          // contact: { type: String, required: true },
          // email: { type: String, required: false },
          // address: { type: Schema.Types.Mixed, required: true },
      }, {
          timestamps: true
      });

      return mongooseClient.model('suppliers', suppliers);
  };