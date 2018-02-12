// templates-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const templates = new Schema({
        facilityId: { type: Schema.Types.ObjectId, require: true },
        scopeLevel: { type: Schema.Types.Mixed, require: true },
        createdBy: { type: Schema.Types.ObjectId, require: true },
        minorLocation: { type: Schema.Types.Mixed, require: true },
        investigation: { type: Schema.Types.Mixed, require: true },
        name: { type: String, required: true },
        result: { type: String, required: false },
        conclusion: { type: String, required: true },
        recommendation: { type: String, required: true },
    }, {
        timestamps: true
    });

    return mongooseClient.model('templates', templates);
};