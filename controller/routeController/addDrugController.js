// external dependency
const Drug = require('../../model/addDrugSchema');

// internal dependency

// show home page
const addDrug = async (req, res, next) => {
    try {
        const drug = await Drug({ ...req.body });
        await drug.save();
        res.json({
            msg: 'New drug Added successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errors: {
                common: err.message,
            },
        });
    }
};

// export
module.exports = { addDrug };
