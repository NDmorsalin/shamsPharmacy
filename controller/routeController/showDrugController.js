/* eslint-disable prettier/prettier */
// external dependency

// internal dependency
const Drug = require('../../model/addDrugSchema');
// show home page
const showDrug = async (req, res, next) => {
    const drug = await Drug.find().sort({ brandName: 1 });
    
    res.json(drug);
};

// update each drug
const updateDrug = async (req, res) => {
    const { id } = req.params;
    console.dir({ id: req.params, body: req.body });
    const updatedDrug = await Drug.findByIdAndUpdate(
        id,
        {
            $set: {
                amountDrug: req.body.amountDrug,
                pricePerPice: req.body.pricePerPice,
                totalPrice: (req.body.amountDrug * req.body.pricePerPice),
            },
        },
        {
            new: true,
        },
    );

    res.json(updatedDrug);
};

// export
module.exports = { showDrug, updateDrug };
