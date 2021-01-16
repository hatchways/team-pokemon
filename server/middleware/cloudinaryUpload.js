const cloudinary = require("cloudinary").v2;

/**
 * Takes a file and uploads it to Cloudinary, returns the url
 */
const upload = (image) => {
   const imageUrl = cloudinary.uploader.upload(image, function(error, result){
        if(error){
            console.log(error);
            return error;
        }
        return result;
    });
    return imageUrl;
}

module.exports.upload = upload;