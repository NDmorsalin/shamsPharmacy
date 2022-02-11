// external dependency
const express = require('express');

// internal dependency
const { showSignupPage, signup } = require('../controller/routeController/signupController');
const avatarUploader = require('../middleware/signup/avatarUploader');
const {
    signupValidator,
    signupValidatorErrorCont,
} = require('../middleware/signup/signupValidator');

const router = express.Router();

// show signup page
router.get('/', showSignupPage);

// signup
router.post('/', avatarUploader, signupValidator, signupValidatorErrorCont, signup);

// export router
module.exports = router;
