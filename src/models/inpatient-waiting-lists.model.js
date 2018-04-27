// inpatientWaitingLists-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const inpatientWaitingLists = new Schema({
        facilityId: { type: Schema.Types.ObjectId, required: true },
        employeeId: { type: Schema.Types.ObjectId, required: true },
        patientId: { type: Schema.Types.ObjectId, required: true },
        clinicId: { type: Schema.Types.Mixed, required: false },
        minorLocationId: { type: Schema.Types.ObjectId, required: true },
        unitId: { type: Schema.Types.ObjectId, required: false }, // Not important. Planning on removing it.
        isAdmitted: { type: Boolean, 'default': false },
        admittedDate: { type: Date, required: false },
        description: { type: String, required: false }
    }, {
        timestamps: true
    });

    return mongooseClient.model('inpatientWaitingLists', inpatientWaitingLists);
};