// immunization-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const vaccineSchema = require('../custom-models/vaccine-model');

module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const immunization = new Schema({
        facilityId: {type: Schema.Types.ObjectId, required: true},
        name: {type: String, required: true},
        vaccines: [vaccineSchema],
        age: {type: Number, required: true},
        date: {type: Date, 'default': Date.now},
        serviceId: {type: Schema.Types.ObjectId, required: true}
    }, {
        timestamps: true
    });

    return mongooseClient.model('immunization', immunization);
};
