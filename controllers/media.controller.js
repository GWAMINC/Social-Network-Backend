import cloudinary from "../utils/cloudinary.js";
export const uploadImage = async (images) => {
    try {
        const urls = [];
        for(let image of images) {
            const uploadedImage = await cloudinary.uploader.upload(image);
            urls.push(uploadedImage.secure_url);
        }
        return urls;
    } catch (error) {
        console.log(error);
    }
}

export const deleteImage = async (images) => {
    try {
        for(let image of images) {
            const public_id = await image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(public_id);
        }
    } catch (error) {
        console.log(error);
    }
}

