// laboratoryReports-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const laboratoryReports = new Schema({
        facilityId: { type: Schema.Types.ObjectId, required: true },
        lab: { type: Schema.Types.ObjectId, required: true },
        workbench: { type: Schema.Types.Mixed, required: true },
        request: { type: Schema.Types.Mixed, required: true },
        patientId: { type: Schema.Types.ObjectId, required: true },
        investigation: { type: Schema.Types.Mixed, required: true },
        result: { type: Schema.Types.Mixed, required: true },
        sampleNumber: { type: String, required: true },
        clinicalDocumentation: { type: String, required: false },
        diagnosis: { type: String, required: false },
        outcome: { type: Schema.Types.Mixed, required: true },
        conclusion: { type: String, required: false },
        recommendation: { type: String, required: false },
        isUploaded: { type: Boolean, 'default': false }
    }, {
        timestamps: true
    });

    return mongooseClient.model('laboratoryReports', laboratoryReports);
};