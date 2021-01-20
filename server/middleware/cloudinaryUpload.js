const cloudinary = require("cloudinary").v2;

/**
 * Takes a file and uploads it to Cloudinary, returns the url
 */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = image => {
  const imageUrl = cloudinary.uploader.upload(image, function (error, result) {
    if (error) {
      console.log(error);
      return error;
    }
    return result;
  });
  return imageUrl;
};

module.exports.upload = upload;
