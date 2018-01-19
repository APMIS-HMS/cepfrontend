// feature-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {
    Schema
  } = mongooseClient;
  const feature = new Schema({
    name: { type: String, required: true },
    moduleId: { type: Schema.Types.Mixed, required: true },
    actions: [{ type: String, required: true, }],
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
  }, {
    timestamps: true
  });

  return mongooseClient.model('feature', feature);
};
