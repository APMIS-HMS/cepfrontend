// facility-modules-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const facilityModules = new Schema({
        name: { type: String, required: true },
        code: { type: String, required: true },
        canDisable: { type: Boolean, require: true },
        route: { type: String, required: true }
    }, { timestamps: true });

    return mongooseClient.model('facilityModules', facilityModules);
};