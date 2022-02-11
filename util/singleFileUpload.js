// external dependency
const multer = require('multer');
const path = require('path');
const createError = require('http-errors');

const uploader = (subFolder, allowedFileTypes, maxFileSize, errMsg) => {
    const uploadFolder = `${__dirname}/../public/upload/${subFolder}/`;

    const storage = multer.diskStorage({
        destination(req, file, cb) {
            cb(null, uploadFolder);
        },
        filename(req, file, cb) {
            const fileExt = path.extname(file.originalname);
            const fileName = `${file.originalname
                .replace(fileExt, '')
                .toLowerCase()
                .split(' ')
                .join('-')}-${Date.now()}`;

            cb(null, fileName + fileExt);
        },
    });

    const upload = multer({
        storage,
        limits: {
            fileSize: maxFileSize,
        },
        fileFilter: (req, file, cb) => {
            if (allowedFileTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(createError(errMsg));
            }
        },
    });

    return upload;
};

module.exports = uploader;
