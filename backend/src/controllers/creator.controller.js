const userModel = require("../models/user.model");
const clipModel = require("../models/clip.model");

async function getCreatorById(req, res) {

  try {

    const creatorId = req.params.id;

    const cloudinary = require("../config/cloudinary");
    
    const streamifier = require("streamifier");

    const creator = await userModel.findById(creatorId);

    if (!creator) {
      return res.status(404).json({
        message: "Creator not found",
      });
    }

    const clips = await clipModel.find({
      creator: creatorId,
    });

    res.status(200).json({
      message: "Creator retrieved successfully",

      creator: {
        ...creator.toObject(),
        clips,
      },
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error",
    });

  }

}

async function updateAvatar(req, res) {

  try {

    if (!req.file) {

      return res.status(400).json({
        message: "Avatar required",
      });

    }



    const uploadResult =
      await new Promise(

        (resolve, reject) => {

          const stream =

            cloudinary.uploader.upload_stream(

              {
                folder:
                  "gametok-avatars",
              },

              (error, result) => {

                if (error)
                  reject(error);

                else
                  resolve(result);

              }

            );



          streamifier

            .createReadStream(
              req.file.buffer
            )

            .pipe(stream);

        }

      );



    req.creator.avatar =
      uploadResult.secure_url;



    await req.creator.save();



    res.status(200).json({

      message:
        "Avatar updated successfully",

      avatar:
        req.creator.avatar,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message:
        "Failed to update avatar",
    });

  }

}


module.exports = {
  getCreatorById,
  updateAvatar
};