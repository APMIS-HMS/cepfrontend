// documentations-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const patientDocumentationSchema = require('../custom-models/patient-documentation-model');

module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const documentations = new Schema({
        personId: { type: Schema.Types.ObjectId, required: true },
        documentations: [patientDocumentationSchema],
    }, {
        timestamps: true
    });

    return mongooseClient.model('documentations', documentations);
};