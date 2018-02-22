// facilityAccessControl-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const facilityAccessControl = new Schema({
        name: { type: String, required: true },
        facilityId: { type: Schema.Types.ObjectId, required: true },
        features: [{ type: Schema.Types.Mixed, required: true }],
        createdAt: { type: Date, 'default': Date.now },
        updatedAt: { type: Date, 'default': Date.now }
    }, {
        timestamps: true
    });

    return mongooseClient.model('facilityAccessControl', facilityAccessControl);
};