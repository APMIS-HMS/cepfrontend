// orderMgtTemplates-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const labSchema = require('../custom-models/order-mgt-lab-model');

module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const orderMgtTemplates = new Schema({
        name: { type: String, required: true },
        facilityId: { type: Schema.Types.ObjectId, required: true },
        createdById: { type: Schema.Types.ObjectId, required: true },
        diagnosis: { type: Schema.Types.Mixed, required: true },
        visibility: { type: Schema.Types.Mixed, required: true },
        type: { type: Schema.Types.Mixed, required: true },
        editedByOthers: { type: Schema.Types.Boolean, default: false },
        body: { type: Schema.Types.String, required: true },
        // name:{ type: String, required: true },
        // facilityId:{ type: Schema.Types.ObjectId, required: true },
        // createdById:{ type: Schema.Types.ObjectId, required: true },
        // medication: [{ type: Schema.Types.Mixed, required: false }],
        // laboratory: [labSchema],
        // diagnosisImage:{ type: Schema.Types.Mixed, required: false },
        // procedures:[{ type: Schema.Types.Mixed, required: false }],
        // immunizations:[{ type: Schema.Types.Mixed, required: false }],
        // nursingCares:[{ type: Schema.Types.Mixed, required: false }],
        // physicianOrders:[{ type: Schema.Types.Mixed, required: false }]
    }, {
        timestamps: true
    });

    return mongooseClient.model('orderMgtTemplates', orderMgtTemplates);
};