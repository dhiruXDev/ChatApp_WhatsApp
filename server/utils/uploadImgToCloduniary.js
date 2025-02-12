const cloudinary  = require("cloudinary").v2;
const uploadImgToCloudinary = async(file , folder, height ,width , quality)=>{
    const options = {folder} ;
    if (height) {
        options.height = height
    }
    if (quality) {
        options.quality = quality
    }
    if (width) {
        options.width = width
    }
    options.resource_type = "auto";// Automatically detect the resource type (image, video, raw, etc.)
    return await cloudinary.uploader.upload(file , options)
}
module.exports = uploadImgToCloudinary
