/* eslint-disable prettier/prettier */
// external dependency

// internal dependency
const uploader = require('../../util/singleFileUpload');

const avatarUploader = (req, res, next) => {
    const upload = uploader(
        'avatar',
        ['image/jpeg', 'image/jpg', 'image/png'],
        10000000,
        'Only .jpg, jpeg or .png format allowed!',
    );

    // call the middleware function
    upload.any()(req, res, (err) => {
        if (err) {
            console.log(err);
            res.json({
                errors: {
                    avatar: {
                        msg: err.message,
                    },
                },
            });
        } else {
            next();
        }
    });
};

// module export
module.exports = avatarUploader;
