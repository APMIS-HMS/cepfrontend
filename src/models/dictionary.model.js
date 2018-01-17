// dictionary-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {
    Schema
  } = mongooseClient;
  const dictionary = new Schema({
    name: {
      type: String,
      required: true
    },
    strenght: {
      type: String,
      required: false
    },
    presentation: {
      type: String,
      required: false
    },
    genericName: {
      type: String,
      required: false
    },
    brandName: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
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

  return mongooseClient.model('dictionary', dictionary);
};
