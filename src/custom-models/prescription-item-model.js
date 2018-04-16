const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productIngredient = require('./product-ingredient-model');
const trackDispensed = require('./track-dispensed-model');

const precribeItemSchema = new Schema({
    facilityId: { type: Schema.Types.ObjectId, required: false }, // Facility that dispensed the drug.
    productId: { type: Schema.Types.ObjectId, required: false },
    productName: { type: String, required: false },
    genericName: { type: String, required: true },
    ingredients: [productIngredient],
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    strength: { type: String, required: false },
    routeName: { type: String, required: false },
    startDate: { type: Date, required: false },
    quantity: { type: Number, required: false },
    quantityDispensed: { type: Number, required: false }, // I need to know the quantity that has been dispensed.
    dispensed: trackDispensed, // This is to keep track of what has been dispensed.
    cost: { type: Number, required: true }, // Unit price of drug.
    totalCost: { type: Number, required: true }, // Total price of drug.
    initiateBill: { type: Boolean, required: false }, // Helps me to know when a bill has been initiated.
    isBilled: { type: Boolean, required: false }, // Helps me to know when a drug has been billed.
    serviceId: { type: Schema.Types.ObjectId, required: false },
    facilityServiceId: { type: Schema.Types.ObjectId, required: false },
    categoryId: { type: Schema.Types.ObjectId, required: false },
    isExternal: { type: Boolean, 'default': false },
    isDispensed: { type: Boolean, 'default': false }, // Using this to track if a drug has been dispensed.
    patientInstruction: { type: String, required: false }
});
module.exports = precribeItemSchema;