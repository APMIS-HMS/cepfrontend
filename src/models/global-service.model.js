// globalService-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const categoryScheme = require('../custom-models/category-model');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {
    Schema
  } = mongooseClient;
  const globalService = new Schema({
    facilityId: {
      type: Schema.Types.ObjectId,
      require: true
    },
    categories: [categoryScheme],
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

  return mongooseClient.model('globalService', globalService);
};
