const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const intervalSchema = new Schema({
    unit: { type: String, required: true },
<<<<<<< HEAD
    sequence: { type: Number, required: false },
=======
    sequence: { type: Number, required: true },
>>>>>>> 016edb995da0b9948183f43cf406c5f60b5da67a
    duration: { type: Number, requred: true }
});

module.exports = intervalSchema;