// immunization-schedule.model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const vaccineSchema = require('../custom-models/vaccine-model');

module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const immunizationScheduleSchema = new Schema({
        facilityId: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        vaccines: [vaccineSchema],
        serviceId: { type: Schema.Types.ObjectId, required: true }
    }, {
        timestamps: true
    });

    return mongooseClient.model('immunizationScheduleSchema', immunizationScheduleSchema);
};