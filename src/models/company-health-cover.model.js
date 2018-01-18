// companyHealthCover-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const personPrincipalSchema = require('../custom-models/personfacilityprincipal-model');


module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {
    Schema
  } = mongooseClient;
  const companyHealthCover = new Schema({
    corporateFacilityId: {
      type: Schema.Types.ObjectId,
      require: true
    },
    facilityId: {
      type: Schema.Types.ObjectId,
      require: true
    },
    personFacilityPrincipals: [personPrincipalSchema],
    categoryId: {
      type: Schema.Types.ObjectId,
      require: true
    },
    isAccepted: {
      type: Boolean,
      'default': false
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

  return mongooseClient.model('companyHealthCover', companyHealthCover);
};
