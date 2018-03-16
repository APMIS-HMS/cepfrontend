// purchaseOrders-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const itemOrdered = require('../custom-models/item-ordered-model');

module.exports = function (app) {
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const purchaseOrders = new Schema({
        facilityId: { type: Schema.Types.ObjectId, required: true },
        purchaseOrderNumber: { type: String, required: false },
        supplierId: { type: Schema.Types.ObjectId, required: true },
        storeId: { type: Schema.Types.ObjectId, required: true },
        createdBy: { type: Schema.Types.ObjectId, required: true },
        expectedDate: { type: Date, required: false },
        remark: { type: String, required: false },
        orderedProducts: [itemOrdered],
        isSupplied: { type: Boolean, 'default': false },
        isActive: { type: Boolean, 'default': true}
    }, {
        timestamps: true
    });

    return mongooseClient.model('purchaseOrders', purchaseOrders);
};
