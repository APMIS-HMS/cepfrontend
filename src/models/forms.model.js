// forms-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const forms = new Schema({
        title: { type: String, required: true },
        scopeLevelId: { type: String, required: true },
        typeOfDocumentId: { type: Schema.Types.ObjectId, require: true },
        facilityId: { type: Schema.Types.ObjectId, require: true },
        moduleIds: [{ type: Schema.Types.ObjectId, require: true }],
        body: { type: String, required: true },
        isSide: { type: Boolean, 'default': false },
        personId: { type: Schema.Types.ObjectId, require: false },
        departmentId: { type: Schema.Types.String, require: false },
        selectedFacilityId: { type: Schema.Types.ObjectId, require: false },
        unitIds: [{ type: Schema.Types.String, require: false }],

    }, {
        timestamps: true
    });

    return mongooseClient.model('forms', forms);
};