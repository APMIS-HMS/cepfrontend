// diagnosises-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const diagnosises = new Schema({
    classId: { type: String, required: false },
    session: { type: String, required: false },
    code: { type: String, required: true },
    name: { type: String, required: true }
  }, {
    timestamps: true
  });

  return mongooseClient.model('diagnosises', diagnosises);
};
