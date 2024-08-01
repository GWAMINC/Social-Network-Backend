import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME.toString(),
    api_key: process.env.CLOUDINARY_API_KEY.toString(),
    api_secret: process.env.CLOUDINARY_API_SECRET.toString(),
});

export const upload = multer({ dest: 'test/' });
export default cloudinary;