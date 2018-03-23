// serviceTags-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const serviceTags = new Schema({
        name: { type: String, required: true },
        facilityId: { type: Schema.Types.ObjectId, required: true },
        tagType: { type: String, required: false }
    }, {
        timestamps: true
    });

    return mongooseClient.model('serviceTags', serviceTags);
};