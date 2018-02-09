// laboratoryRequests-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const laboratoryRequests = new Schema({
        facilityId: { type: Schema.Types.ObjectId, required: true },
        patientId: { type: Schema.Types.ObjectId, required: true },
        createdBy: { type: Schema.Types.ObjectId, required: true },
        labNumber: { type: String, required: false },
        clinicalInformation: { type: String, required: false },
        diagnosis: { type: String, required: false },
        investigations: [{ type: Schema.Types.Mixed, required: true }],
        billingId: { type: Schema.Types.Mixed, required: false }
    }, {
        timestamps: true
    });

    return mongooseClient.model('laboratoryRequests', laboratoryRequests);
};