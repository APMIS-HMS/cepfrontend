// workbenches-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const workbenches = new Schema({
        facilityId: { type: Schema.Types.ObjectId, required: true },
        laboratoryId: { type: Schema.Types.ObjectId, required: true },
        minorLocationId: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        isActive: { type: Boolean, 'default': true },
    }, {
        timestamps: true
    });

    return mongooseClient.model('workbenches', workbenches);
};