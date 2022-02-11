/* eslint-disable comma-dangle */
// external dependency
const mongoose = require('mongoose');

const pharmacistSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        avatar: String,
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Signup model pharmacist.js
const Pharmacist = mongoose.model('Pharmacist', pharmacistSchema);

// module export
module.exports = Pharmacist;
