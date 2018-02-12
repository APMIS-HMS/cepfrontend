// investigations-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const investigations = new Schema({
        facilityId: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        specimen: { type: Schema.Types.Mixed, require: false },
        reportType: { type: Schema.Types.Mixed, require: false },
        unit: { type: String, required: false },
        isPanel: { type: Boolean, 'default': false },
        panel: { type: Schema.Types.Mixed, require: false },
        facilityServiceId: { type: Schema.Types.ObjectId, require: true },
        serviceId: { type: Schema.Types.ObjectId, require: true },
        LaboratoryWorkbenches: [{ type: Schema.Types.Mixed }]
    }, {
        timestamps: true
    });

    return mongooseClient.model('investigations', investigations);
};