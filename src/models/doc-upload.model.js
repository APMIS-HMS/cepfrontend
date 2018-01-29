// docUpload-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {
    Schema
  } = mongooseClient;
  const docUpload = new Schema({
    facilityId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    patientId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    docType: {
      type: String,
      required: true
    },
    docName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    docUrl: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
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

  return mongooseClient.model('docUpload', docUpload);
};
