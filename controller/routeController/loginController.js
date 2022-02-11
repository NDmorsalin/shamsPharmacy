// external dependency
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// internal dependency
const Pharmacist = require('../../model/pharmacist');

// show home page
const showLogin = async (req, res, next) => {
    res.render('login');
};

// login
const login = async (req, res, next) => {
    try {
        const pharmacist = await Pharmacist.findOne({
            $or: [{ email: req.body.email }, { phone: req.body.email }],
        });
        if (pharmacist) {
            // check password
            const isValidPassword = await bcrypt.compare(req.body.password, pharmacist.password);

            if (isValidPassword) {
                // data of pharmacist
                const pharmacistData = {
                    phone: pharmacist.phone,
                    email: pharmacist.email,
                    name: pharmacist.name,
                    avatar: pharmacist?.filename || null,
                };

                const token = jwt.sign(pharmacistData, process.env.JWT_SECRET, {
                    expiresIn: 10 * process.env.COOKIE_EXPIRE,
                });

                // set cookies
                res.cookie(process.env.COOKIE_NAME, token, {
                    expires: new Date(Date.now() + 10 * process.env.COOKIE_EXPIRE),
                    httpOnly: true,
                    signed: true,
                });

                res.json({
                    msg: 'Login successfully',
                });
            }
        } else {
            res.status(403).json({
                errors: {
                    email: {
                        msg: 'your Email is incorrect',
                    },
                },
            });
        }
    } catch (err) {
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
module.exports = { showLogin, login };
