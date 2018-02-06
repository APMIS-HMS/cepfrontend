// severity-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const severity = new Schema({
    name: { type: String, required: true },
  }, {
    timestamps: true
  });

  return mongooseClient.model('severity', severity);
};
