/* eslint-disable prettier/prettier */
// external dependency
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// internal dependency
const Pharmacist = require('../../model/pharmacist');
// show Signup Page
const showSignupPage = async (req, res, next) => {
    res.render('signup');
};

// signup request
const signup = async (req, res, next) => {
    try {
        // hash password
        const hashPassword = await bcrypt.hash(req.body.password, 10);

        // data of pharmacist
        const pharmacistData = {
                phone: req.body.phone,
                email: req.body.email,
                name: req.body.name,
                avatar: req.files[0]?.filename || null,
        };

        // save pharmacist data in to database
        const pharmacist = await Pharmacist({
            ...pharmacistData,
            password: hashPassword,
        });
        await pharmacist.save();

        // creat token when signin
        const token = jwt.sign(
            pharmacistData,
            process.env.JWT_SECRET,
            {
                expiresIn: '10h',
            },
        );
        // set cookies
        res.cookie(process.env.COOKIE_NAME, token, {
            expires: new Date(Date.now() + 10 * process.env.COOKIE_EXPIRE),
            httpOnly: true,
            signed: true,
        });

        // send data to request
        res.json({
            pharmacistData,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errors: {
                common: {
                    msg: err.message,
                },
            },
        });
    }
};

// export
module.exports = { showSignupPage, signup };
