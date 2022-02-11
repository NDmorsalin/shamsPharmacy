/* eslint-disable comma-dangle */
// external dependency
const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema(
    {
        name: String,
        phone: String,
        totalDue: {
            type: Number,
            default: 0,
        },
        totalPaid: {
            type: Number,
            default: 0,
        },
        buyingHistory: [
            {
                drugName: [String],
                date: String,
                amount: Number,
            },
        ],
        paidHistory: [
            {
                date: String,
                amount: Number,
            },
        ],
    },
    {
        timestamps: true,
    }
);

const UnpaidBuyer = mongoose.model('UnpaidBuyer', buyerSchema);
module.exports = UnpaidBuyer;
