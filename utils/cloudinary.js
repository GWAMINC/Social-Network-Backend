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

// import multer from 'multer';
// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

// // Cấu hình Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Cấu hình Multer với CloudinaryStorage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'temporary/',
//     allowed_formats: ['jpg', 'png', 'jpeg'],
//   },
// });

// export const upload = multer({ storage: storage });

// export default cloudinary;