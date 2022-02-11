/* eslint-disable prettier/prettier */
// external dependency
const { check, validationResult } = require('express-validator');
const { unlink } = require('fs');
const path = require('path');
const creatError = require('http-errors');
// internal dependency
const Pharmacist = require('../../model/pharmacist');

const signupValidator = [
    check('email') // todo only one email is allowed
        .isLength({ min: 1 })
        .withMessage('Email is empty')
        .isEmail()
        .withMessage('email is not valid')
        .custom(async (value) => {
            try {
                const pharmacist = await Pharmacist.findOne({ email: value });
                if (pharmacist) {
                    throw new Error('Email is already Used');
                }
                return true;
            } catch (err) {
                throw new Error(err.message);
            }
        }),

    check('name')
        .isLength({ min: 1 })
        .withMessage('Name is empty')
        .isAlpha('en-US', { ignore: ' -' })
        .withMessage('Name is must be Alphabet'),

    check('phone')// todo only one phone number is allowed
        .isLength({ min: 1 })
        .withMessage('Phone Number is empty')
        .isMobilePhone('bn-BD')
        .withMessage('phone number is must be Bangladeshi Phone number')
        .custom(async (value) => {
            const pharmacist = await Pharmacist.findOne({ phone: value });

            if (pharmacist) {
                throw new Error('Phone is already used');
            }
                return true;
        }),

    check('password')
        .isStrongPassword()
        .withMessage('Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol'),
];

const signupValidatorErrorCont = (req, res, next) => {
    const error = validationResult(req);
    const mapError = error.mapped();
    if (Object.keys(mapError).length === 0) {
        next();
    } else {
        if (req.files.length > 0) {
            const { filename } = req.files[0];
            unlink(path.join(__dirname, `../../public/upload/avatar/${filename}`), (err) => {
                if (err) console.log(err);
            });
        }
        res.json({
            errors: mapError,
        });
    }
};

// export
module.exports = {
    signupValidator,
    signupValidatorErrorCont,
};
