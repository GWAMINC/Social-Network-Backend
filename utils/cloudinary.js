import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';

// cloudinary.config({
//     cloud_name: String(process.env.CLOUDINARY_NAME),
//     api_key: String(process.env.CLOUDINARY_API_KEY),
//     api_secret: String(process.env.CLOUDINARY_API_SECRET),
// });

cloudinary.config({
    cloud_name: "diblfklia",
    api_key: "952868696595395",
    api_secret: "TQA34Bnos7zdSStwJ4qOaZs6BxQ",
});

export const upload = multer({ dest: 'temporary/' });
export default cloudinary;