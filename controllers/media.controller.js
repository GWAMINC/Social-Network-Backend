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
export const upload1Image = async (imagePath) => {
    try {
      const uploadedImage = await cloudinary.uploader.upload(imagePath);
      return uploadedImage.secure_url;
    } catch (error) {
      console.error("Error uploading image to cloudinary:", error);
      throw new Error("Error uploading image to cloudinary");
    }
  };

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
export const uploadVideo = async (videos) => {
    try {
        const urls = [];
        for (let video of videos) {
            const uploadedVideo = await cloudinary.uploader.upload(video, {
                resource_type: "video"  // Chỉ định rằng đây là video
            });
            urls.push(uploadedVideo.secure_url);
        }
        return urls;
    } catch (error) {
        console.log(error);
        throw new Error("Error uploading videos");
    }
};
