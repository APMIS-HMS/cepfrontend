const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const featureSchema = new Schema({
    featureId: {
        type: Schema.Types.ObjectId,
        required: false
    },
    accessControlId:
    {
        type: Schema.Types.ObjectId,
        required: false
    },
    crud: [{
        type: String,
        required: false
    }],
    createdAt: {
        type: Date,
        'default': Date.now
    },
    updatedAt: {
        type: Date,
        'default': Date.now
    }
});
module.exports = featureSchema;