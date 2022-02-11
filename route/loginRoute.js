// external dependency
const express = require('express');

// internal dependency
const { showLogin, login } = require('../controller/routeController/loginController');
const { loginValidator, loginValidatorErr } = require('../middleware/login/loginValidator');
const { checkLogin, redirectLogin } = require('../middleware/login/checkLogin');

const router = express.Router();

// show login page
router.get('/', redirectLogin, showLogin);

// login
router.post('/', loginValidator, loginValidatorErr, redirectLogin, login);

// export router
module.exports = router;
