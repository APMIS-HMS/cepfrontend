// bedOccupancy-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const bedOccupancy = new Schema({
        facilityId: { type: Schema.Types.ObjectId, required: true },
        minorLocationId: { type: Schema.Types.ObjectId, required: true },
        roomId: { type: Schema.Types.ObjectId, required: true },
        bedId: { type: Schema.Types.ObjectId, required: true },
        patientId: { type: Schema.Types.ObjectId, required: false }, 
        admittedDate: { type: Schema.Types.Date, required: false },
        bedState: {type: Schema.Types.Date, required: true}, // Available, Occupied
        admittedBy: {type: Schema.Types.Date, required: true},
        history: [
            {
                admittedDate: Date,
                dischargedDate: Date,
                dischargedBy: String,
                admittedBy: String,
                patientId: String,
                dischargeType: String
            }
        ]
    }, {
        timestamps: true
    });

    return mongooseClient.model('bedOccupancy', bedOccupancy);
};
