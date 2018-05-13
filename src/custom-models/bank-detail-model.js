const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bankSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    accountNo: {
        type: String,
        required: false
    },
    accountType: {
        type: Schema.Types.ObjectId,
        required: false
    },
    branch: {
        type: Schema.Types.ObjectId,
        required: false
    },
    sortCode: {
        type: Schema.Types.ObjectId,
        required: false
    },
    createdAt: {
        type: Date,
        'default': Date.now
    },
    updatedAt: {
        type: Date,
        'default': Date.now
    },
});
module.exports = bankSchema;
