/* eslint-disable operator-linebreak */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable comma-dangle */
// external dependency
// internal dependency
const Drug = require('../../model/addDrugSchema');
const UnpaidBuyer = require('../../model/buyerSchema');
const { Sell, UnpaidSell } = require('../../model/sellSchema');
// show home page
const showHomePage = async (req, res, next) => {
    res.render('index');
};

// name of drugs
const drugName = async (req, res, next) => {
    res.json(req.drugNames);
};

// paid sell
const paidSell = async (req, res, next) => {
    const sell = await Sell.findOne({ date: req.body.date });

    if (sell) {
        const isSell = sell.drugsName.find((eachDrug) => eachDrug.dName === req.body.brandName);

        if (isSell) {
            const indexNm = sell.drugsName.indexOf(isSell);

            sell.drugsName[indexNm] = {
                dName: req.body.brandName,
                amount: sell.drugsName[indexNm].amount + req.body.amountDrug,
                price: req.body.pricePerPice,
            };
            sell.totalSell += req.body.amountDrug * req.body.pricePerPice;
            sell.save();
        } else {
            const newSell = await Sell.findOneAndUpdate(
                { date: req.body.date },
                {
                    $push: {
                        drugsName: {
                            dName: req.body.brandName,
                            amount: req.body.amountDrug,
                            price: req.body.pricePerPice,
                        },
                    },
                    totalSell: sell.totalSell + req.body.amountDrug * req.body.pricePerPice,
                },

                {
                    new: true,
                }
            );
        }
    } else {
        const newSell = await Sell({
            drugsName: [
                {
                    dName: req.body.brandName,
                    amount: req.body.amountDrug,
                    price: req.body.pricePerPice,
                },
            ],
            totalSell: req.body.amountDrug * req.body.pricePerPice,
            date: req.body.date,
        });

        const soled = await newSell.save();
    }
    const drug = await Drug.findOne({ brandName: req.body.brandName });
    const newDrug = await Drug.findOneAndUpdate(
        { brandName: req.body.brandName },
        {
            $set: {
                amountDrug: drug.amountDrug - req.body.amountDrug,
                pricePerPice: drug.pricePerPice || req.body.pricePerPice,
                totalPrice:
                    (drug.amountDrug - req.body.amountDrug) *
                    (drug.pricePerPice || req.body.pricePerPice),
            },
        },

        {
            new: true,
        }
    );

    res.json({
        msg: newDrug,
    });
};
// unpaid sell
const unpaidSell = async (req, res, next) => {
    const unpaid = await UnpaidSell.findOne({ date: req.body.date });

    if (unpaid) {
        const isUnpaidSell = unpaid.drugsName.find(
            (eachDrug) => eachDrug.dName === req.body.unpaidDrugName
        );
        const isUnpaidSellBuyer = unpaid.buyer.find((buyer) => {
            const isTrue =
                buyer.name === req.body.unpaidBuyerName &&
                buyer.phone === req.body.unpaidBuyerPhone;

            return isTrue;
        });

        if (isUnpaidSell) {
            const indexNm = unpaid.drugsName.indexOf(isUnpaidSell);

            unpaid.drugsName[indexNm] = {
                dName: req.body.unpaidDrugName,
                amount: unpaid.drugsName[indexNm].amount + req.body.unpaidDrugAmount,
                price: req.body.unpaidPricePerPice,
            };
            unpaid.totalSell += req.body.unpaidDrugAmount * req.body.unpaidPricePerPice;
            unpaid.save();
        } else {
            const newUnpaid = await UnpaidSell.findOneAndUpdate(
                { date: req.body.date },
                {
                    $push: {
                        drugsName: {
                            dName: req.body.unpaidDrugName,
                            amount: req.body.unpaidDrugAmount,
                            price: req.body.unpaidPricePerPice,
                        },
                    },
                    totalSell:
                        unpaid.totalSell + req.body.unpaidDrugAmount * req.body.unpaidPricePerPice,
                },

                {
                    new: true,
                }
            );
        }

        if (!isUnpaidSellBuyer) {
            const newUnpaid = await UnpaidSell.findOneAndUpdate(
                { date: req.body.date },
                {
                    $push: {
                        buyer: {
                            name: req.body.unpaidBuyerName,
                            phone: req.body.unpaidBuyerPhone,
                        },
                    },
                },

                {
                    new: true,
                }
            );
        }

        const unpaidBuyer = await UnpaidBuyer.findOne({
            name: req.body.unpaidBuyerName,
            phone: req.body.unpaidBuyerPhone,
        });
        if (unpaidBuyer) {
            unpaidBuyer.totalDue =
                unpaidBuyer.totalDue +
                req.body.unpaidDrugAmount * req.body.unpaidPricePerPice -
                req.body.paidTkAmount;

            unpaidBuyer.totalPaid += req.body.paidTkAmount;
            const isTodyBuy = unpaidBuyer.buyingHistory.find(
                (history) => history.date === req.body.date
            );

            if (isTodyBuy) {
                const indexNum = unpaidBuyer.buyingHistory.indexOf(isTodyBuy);

                unpaidBuyer.buyingHistory[indexNum].drugName.push(`${req.body.unpaidDrugName}`);
                unpaidBuyer.buyingHistory[indexNum].amount +=
                    req.body.unpaidDrugAmount * req.body.unpaidPricePerPice;
            } else {
                unpaidBuyer.buyingHistory.push({
                    drugName: [`${req.body.unpaidDrugName}`],
                    date: req.body.date,
                    amount: req.body.unpaidDrugAmount * req.body.unpaidPricePerPice,
                });
            }
            const isTodyPaid = unpaidBuyer.paidHistory.find(
                (history) => history.date === req.body.date
            );

            if (isTodyPaid) {
                const indexNum = unpaidBuyer.paidHistory.indexOf(isTodyPaid);
                unpaidBuyer.paidHistory[indexNum].amount += req.body.paidTkAmount;
            } else {
                unpaidBuyer.paidHistory.push({
                    date: req.body.date,
                    amount: req.body.paidTkAmount,
                });
            }

            await unpaidBuyer.save();
            
        } else {
            const newUnpaidBuyer = await UnpaidBuyer({
                name: req.body.unpaidBuyerName,
                phone: req.body.unpaidBuyerPhone,
                totalDue:
                    req.body.unpaidDrugAmount * req.body.unpaidPricePerPice - req.body.paidTkAmount,
                totalPaid: req.body.paidTkAmount,
                buyingHistory: [
                    {
                        drugName: [`${req.body.unpaidDrugName}`],
                        date: req.body.date,
                        amount: req.body.unpaidDrugAmount * req.body.unpaidPricePerPice,
                    },
                ],
                paidHistory: [
                    {
                        date: req.body.date,
                        amount: req.body.paidTkAmount,
                    },
                ],
            });
            
            await newUnpaidBuyer.save();
        }
    } else {
        const newUnpaid = await UnpaidSell({
            drugsName: [
                {
                    dName: req.body.unpaidDrugName,
                    amount: req.body.unpaidDrugAmount,
                    price: req.body.unpaidPricePerPice,
                },
            ],
            totalSell: req.body.unpaidDrugAmount * req.body.unpaidPricePerPice,
            buyer: [
                {
                    name: req.body.unpaidBuyerName,
                    phone: req.body.unpaidBuyerPhone,
                },
            ],
            date: req.body.date,
        });

        const unpaidSoled = await newUnpaid.save();
        

        const unpaidBuyer = await UnpaidBuyer.findOne({
            name: req.body.unpaidBuyerName,
            phone: req.body.unpaidBuyerPhone,
        });

        if (unpaidBuyer) {
            unpaidBuyer.totalDue =
                unpaidBuyer.totalDue +
                req.body.unpaidDrugAmount * req.body.unpaidPricePerPice -
                req.body.paidTkAmount;

            unpaidBuyer.totalPaid += req.body.paidTkAmount;

            const isTodyBuy = unpaidBuyer.buyingHistory.find(
                (history) => history.date === req.body.date
            );
            if (isTodyBuy) {
                const indexNum = unpaidBuyer.buyingHistory.indexOf(isTodyBuy);

                unpaidBuyer.buyingHistory[indexNum].drugName.push(`${req.body.unpaidDrugName}`);
                unpaidBuyer.buyingHistory[indexNum].amount +=
                    req.body.unpaidDrugAmount * req.body.unpaidPricePerPice;
            } else {
                unpaidBuyer.buyingHistory.push({
                    drugName: [`${req.body.unpaidDrugName}`],
                    date: req.body.date,
                    amount: req.body.unpaidDrugAmount * req.body.unpaidPricePerPice,
                });
            }

            const isTodyPaid = unpaidBuyer.paidHistory.find(
                (history) => history.date === req.body.date
            );
            if (isTodyPaid) {
                const indexNum = unpaidBuyer.paidHistory.indexOf(isTodyPaid);
                unpaidBuyer.paidHistory[indexNum].amount += req.body.paidTkAmount;
            } else {
                unpaidBuyer.paidHistory.push({
                    date: req.body.date,
                    amount: req.body.paidTkAmount,
                });
            }

            await unpaidBuyer.save();
        } else {
            const newUnpaidBuyer = await UnpaidBuyer({
                name: req.body.unpaidBuyerName,
                phone: req.body.unpaidBuyerPhone,
                totalDue:
                    req.body.unpaidDrugAmount * req.body.unpaidPricePerPice - req.body.paidTkAmount,
                totalPaid: req.body.paidTkAmount,
                buyingHistory: [
                    {
                        drugName: [`${req.body.unpaidDrugName}`],
                        date: req.body.date,
                        amount: req.body.unpaidDrugAmount * req.body.unpaidPricePerPice,
                    },
                ],
                paidHistory: [
                    {
                        date: req.body.date,
                        amount: req.body.paidTkAmount,
                    },
                ],
            });
            
            await newUnpaidBuyer.save();
        }
    }
    const drug = await Drug.findOne({ brandName: req.body.unpaidDrugName });
    const newDrug = await Drug.findOneAndUpdate(
        { brandName: req.body.unpaidDrugName },
        {
            $set: {
                amountDrug: drug.amountDrug - req.body.unpaidDrugAmount,
                pricePerPice: drug.pricePerPice || req.body.unpaidPricePerPice,
                totalPrice:
                    (drug.amountDrug - req.body.unpaidDrugAmount) *
                    (drug.pricePerPice || req.body.unpaidPricePerPice),
            },
        },

        {
            new: true,
        }
    );

    res.json({
        msg: 'unpaid sell',
        data: {
            newDrug,
        },
    });
};

// price of selected drug
const price = async (req, res, next) => {
    try {
        const drug = await Drug.findOne({ brandName: req.params.drugName });
        if (drug) {
            res.json(drug);
        } else {
            res.status(404).json({
                errors: {
                    common: {
                        msg: 'Not found',
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

// show invest and due
const capital = async (req, res, next) => {
    const allDrug = await Drug.find();
    let invest = 0;
    allDrug.forEach((drug) => {
        invest += drug.totalPrice;
    });

    const allDue = await UnpaidBuyer.find();
    let due = 0;
    allDue.forEach((buyer) => {
        due += buyer.totalDue;
    });

    res.json({
        invest,
        due,
    });
};

// export
module.exports = {
    showHomePage,
    paidSell,
    unpaidSell,
    price,
    drugName,
    capital,
};
