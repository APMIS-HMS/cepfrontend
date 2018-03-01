// stores-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const mStore = require('../models/stores.model');
const productTypeIdModel = require('../custom-models/product-typeId-model');

module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const stores = new Schema({
        facilityId: { type: Schema.Types.ObjectId, require: true },
        name: { type: String, required: true },
        description: { type: String, required: false },
        store:[mStore],
        minorLocationId:{ type: Schema.Types.ObjectId, require: true },
        productTypeId:[productTypeIdModel],
        canDespense:{ type: Boolean, 'default': false },
        canReceivePurchaseOrder:{ type: Boolean, 'default': false }
    }, {
        timestamps: true
    });

    return mongooseClient.model('stores', stores);
};
