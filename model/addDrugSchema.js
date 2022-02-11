/* eslint-disable comma-dangle */
// external dependency
const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema(
    {
        brandName: {
            type: String,
            required: true,
        },
        groupName: String,
        companyName: String,
        power: String,
        typeDrug: String,
        amountDrug: {
            type: Number,
            required: true,
        },
        pricePerPice: {
            type: Number,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        timestamps: true,
    }
);

const Drug = mongoose.model('Drug', drugSchema);

module.exports = Drug;
