const cloudinary = require("cloudinary").v2;

const streamifier = require("streamifier");

const env = require("../config/env");

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,

  api_key: env.cloudinary.apiKey,

  api_secret: env.cloudinary.apiSecret,
});

function uploadToCloudinary(
  fileBuffer,
  options = {}
) {
  return new Promise((resolve, reject) => {

    const stream =
      cloudinary.uploader.upload_stream(
        options,

        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

    streamifier
      .createReadStream(fileBuffer)
      .pipe(stream);
  });
}

async function uploadClipVideo(fileBuffer) {
  return uploadToCloudinary(fileBuffer, {
    resource_type: "video",

    folder: "gametok/clips",
  });
}

async function uploadAvatar(fileBuffer) {
  return uploadToCloudinary(fileBuffer, {
    folder: "gametok/avatars",
  });
}

async function uploadBanner(fileBuffer) {
  return uploadToCloudinary(fileBuffer, {
    folder: "gametok/banners",
  });
}

async function deleteMedia(
  publicId,
  resourceType = "image"
) {
  return cloudinary.uploader.destroy(
    publicId,
    {
      resource_type: resourceType,
    }
  );
}

function generateThumbnail(videoUrl) {
  return videoUrl
    .replace(
      "/upload/",
      "/upload/so_1/"
    )
    .replace(".mp4", ".jpg");
}

module.exports = {
  uploadClipVideo,

  uploadAvatar,

  uploadBanner,

  deleteMedia,

  generateThumbnail,
};