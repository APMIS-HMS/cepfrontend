// documentation-templates-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const documentationTemplates = new Schema({
        facilityId: { type: Schema.Types.ObjectId, required: false },
        data: { type: Schema.Types.Mixed, required: true },
        isEditable: { type: Schema.Types.Boolean, default: false },
        name: { type: String, required: true },
        visibility: { type: String, required: true },
        form: { type: Schema.Types.ObjectId, required: true },
        userId: { type: Schema.Types.ObjectId, required: true }
    }, {
        timestamps: true
    });

    return mongooseClient.model('documentationTemplates', documentationTemplates);
};