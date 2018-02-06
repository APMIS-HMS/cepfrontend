// facility-modules-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const facilityModules = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
<<<<<<< HEAD
    canDisable:{ type: Boolean, require: true }
  }, {
    timestamps: true
  });
=======
    route: { type:String, required: true }
  }, { timestamps: true });
>>>>>>> remotes/origin/fundwallet

  return mongooseClient.model('facilityModules', facilityModules);
};
