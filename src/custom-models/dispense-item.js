const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dispenseSchema = new Schema({
    product: {
        type: Schema.Types.Mixed,
        require: false
    }, // { productId, productName };
    cost: {
        type: Number,
        required: false
    },
    quantity: {
        type: Number,
        required: false
    },
    isRefill: {
        type: Boolean,
        'default': false
    },
    refillCount: {
        type: Number,
        required: false
    },
    startDate: {
        type: Date,
        'default': Date.now
    },
    batchNumber: {
        type: String,
        required: false
    },
    instruction: {
        type: String,
        required: false
    },
    isExternal: {
        type: Boolean,
        'default': false
    },
    createdAt: {
        type: Date,
        'default': Date.now
    },
    updatedAt: {
        type: Date,
        'default': Date.now
    }
});
module.exports = dispenseSchema;
