// external dependency
const express = require('express');

// internal dependency
const { addDrug } = require('../controller/routeController/addDrugController');

const router = express.Router();
router.get('/', (req, res) => {
    res.redirect('/');
});
router.post('/', addDrug);
// export router
module.exports = router;
