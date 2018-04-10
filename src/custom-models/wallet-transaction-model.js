const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletTransactionSchema = new Schema({
    transactionType: { type: String, default: 'Cr' },
    amount: { type: Schema.Types.Number, default: 0 },
    transactionMedium: { type: String, default: 'Cash' },
    transactionStatus: { type: String, default: 'InComplete' },
    refCode: { type: String, required: false },
    destinationId: { type: String, required: false },
    destinationType: { type: String, required: false },
    sourceId: { type: String, required: false },
    sourceType: { type: String, required: false },
    paidBy: { type: String, required: false },
    balance: { type: Schema.Types.Number, default: 0 },
    ledgerBalance: { type: Schema.Types.Number, default: 0 },
    description: { type: String, required: false },
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
});
module.exports = walletTransactionSchema;