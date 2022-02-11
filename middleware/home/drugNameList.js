/* eslint-disable prettier/prettier */
// external dependency

// internal dependency
const Drug = require('../../model/addDrugSchema');

const drugNameList = async (req, res, next) => {
    try {
        const drugs = await Drug.find();
        const drugNames = [];
        drugs.forEach((drug) => {
            drugNames.push(drug.brandName);
        });

        req.drugNames = drugNames;

        next();
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

const price = async (req, res, next) => {
    try {
        const drugs = await Drug.findOne({});
        const drugNames = [];
        drugs.forEach((drug) => {
            drugNames.push(drug.brandName);
        });

        req.drugNames = drugNames;

        next();
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

module.exports = { drugNameList };
