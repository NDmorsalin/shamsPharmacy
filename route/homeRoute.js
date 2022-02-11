// external dependency
const express = require('express');

// internal dependency
const {
    showHomePage,
    drugName,
    paidSell,
    unpaidSell,
    price,
    capital
} = require('../controller/routeController/homeController');

const { drugNameList } = require('../middleware/home/drugNameList');

const { checkLogin } = require('../middleware/login/checkLogin');

const router = express.Router();

router.get('/', checkLogin, showHomePage);
router.get('/paidSell', checkLogin, drugNameList, drugName);

router.post('/paidSell', checkLogin, paidSell);

router.post('/unpaidSell', checkLogin, unpaidSell);

// price of selected price
router.get('/price/:drugName', checkLogin, price);
// show invest and due
router.get('/capital', checkLogin, capital);

// export router
module.exports = router;
