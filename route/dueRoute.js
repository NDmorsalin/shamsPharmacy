// external dependency
const express = require('express');

// internal dependency
const { showDue } = require('../controller/routeController/dueController');

const router = express.Router();

router.get('/', showDue);
// export router
module.exports = router;
