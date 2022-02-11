// external dependency
const jwt = require('jsonwebtoken');

const checkLogin = async (req, res, next) => {
    try {
        const token = req.signedCookies[process.env.COOKIE_NAME];
        const pharmacistData = jwt.verify(token, process.env.JWT_SECRET);
        req.pharmacistData = pharmacistData;
        next();
    } catch (err) {
        /* console.log(err.message);
        res.json({
            errors: {
                common: {
                    msg: err.message,
                },
            },
        }); */
        res.redirect('/login');
    }
};

const redirectLogin = async (req, res, next) => {
    try {
        const token = req.signedCookies[process.env.COOKIE_NAME];
        const pharmacistData = jwt.verify(token, process.env.JWT_SECRET);
        if (pharmacistData) {
            res.redirect('/');
        }
    } catch (err) {
        next();
    }
};
module.exports = { checkLogin, redirectLogin };
