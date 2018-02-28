// treatment-sheets-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const treatmentSheets = new Schema({
        personId: { type: Schema.Types.ObjectId, required: true },
        facilityId: { type: Schema.Types.ObjectId, required: true },
        treatmentSheet: { type: Schema.Types.Mixed, required: true },
        createdBy: { type: Schema.Types.ObjectId, required: true },
        completed: { type: Schema.Types.Boolean, default: false },
    }, {
        timestamps: true
    });

    return mongooseClient.model('treatmentSheets', treatmentSheets);
};