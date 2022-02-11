/* eslint-disable comma-dangle */
// external dependency
const mongoose = require('mongoose');

const sellSchema = new mongoose.Schema(
    {
        drugsName: [
            {
                dName: String,
                amount: Number,
                price: Number,
            },
        ],
        totalSell: {
            type: Number,
            required: true,
        },
        date: String,
    },
    {
        timestamps: true,
    }
);
const unpaidSellSchema = new mongoose.Schema(
    {
        drugsName: [
            {
                dName: String,
                amount: Number,
                price: Number,
            },
        ],
        totalSell: {
            type: Number,
            required: true,
        },
        buyer: [
            {
                name: String,
                phone: String,
            },
        ],
        date: String,
    },
    {
        timestamps: true,
    }
);

const Sell = mongoose.model('Sell', sellSchema);

const UnpaidSell = mongoose.model('UnpaidSell', unpaidSellSchema);

module.exports = { Sell, UnpaidSell };
