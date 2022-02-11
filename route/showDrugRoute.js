// external dependency
const express = require('express');

// internal dependency
const { showDrug, updateDrug } = require('../controller/routeController/showDrugController');

const router = express.Router();

router.get('/', showDrug);

// update each drug
router.put('/:id', updateDrug);
// export router
module.exports = router;
