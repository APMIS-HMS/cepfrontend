// bedOccupancy-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
const bedOccupancyHistoryScheme = require('../custom-models/bed-occupancy-history');
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const bedOccupancy = new Schema({
        facilityId: { type: Schema.Types.ObjectId, required: true },
        minorLocationId: { type: Schema.Types.ObjectId, required: true },
        roomId: { type: Schema.Types.ObjectId, required: true },
        bedId: { type: Schema.Types.ObjectId, required: true },
        patientId: { type: Schema.Types.ObjectId, required: false },
        admittedDate: { type: Schema.Types.Date, required: false },
        bedState: { type: Schema.Types.String, required: true }, // Available, Occupied
        isAvailable: { type: Schema.Types.Boolean, default: true },
        admittedBy: { type: Schema.Types.ObjectId, required: false },
        history: [bedOccupancyHistoryScheme]
    }, {
        timestamps: true
    });

    return mongooseClient.model('bedOccupancy', bedOccupancy);
};