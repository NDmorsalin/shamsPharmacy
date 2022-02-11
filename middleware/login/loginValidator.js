/* eslint-disable prettier/prettier */
// external dependency
const { check, validationResult } = require('express-validator');

// internal dependency
const Pharmacist = require('../../model/pharmacist');

const loginValidator = [
    check('email')
        .isLength({ min: 1 })
        .withMessage('Email Or Phone Filed is empty'),
    check('password')
        .isLength({ min: 1 })
        .withMessage('Password Filed is empty')
        .isStrongPassword()
        .withMessage('Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'),
];

const loginValidatorErr = async (req, res, next) => {
    const error = validationResult(req);
    const mpErr = error.mapped();
    if (Object.keys(mpErr).length === 0) {
        next();
    } else {
        res.status(500).json({
            errors: mpErr,
        });
    }
};

module.exports = { loginValidator, loginValidatorErr };
