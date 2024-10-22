import multer from 'multer';
import ApiError from "../utils/ApiError.js";


const multerOptions = () => {
    // 2- memoryStorage save picture in memory  as a buffer
    const multerStorage = multer.memoryStorage()

    // validion image
    const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new ApiError('Only Images Allowed', 400), false);
    }
    }

    const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
    return upload;
}

export const uploadUserImage = (fieldName) => multerOptions().single(fieldName);







