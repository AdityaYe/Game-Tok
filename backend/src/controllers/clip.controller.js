const clipModel = require("../models/clip.model");

const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");

const cloudinary =
  require("../services/storage.service");

const streamifier =
  require("streamifier");



// CREATE CLIP
async function createClip(req, res) {

  try {

    if (!req.file) {

      return res.status(400).json({
        message: "Clip file is required",
      });

    }



    const uploadResult =
      await new Promise((resolve, reject) => {

        const stream =
          cloudinary.uploader.upload_stream(
            {
              resource_type: "video",
              folder: "gametok",
            },

            (error, result) => {

              if (error) reject(error);
              else resolve(result);

            }
          );



        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);

      });



    const clip = await clipModel.create({

      gameName: req.body.gameName,

      description: req.body.description,

      genre: req.body.genre,

      steamUrl: req.body.steamUrl,

      video: uploadResult.secure_url,

      creator: req.creator._id,

      likeCount: 0,

      savesCount: 0,

    });



    res.status(201).json({

      message: "Clip uploaded successfully",

      clip,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

  }

}



// GET ALL CLIPS
async function getClips(req, res) {

  try {

    const clips = await clipModel
      .find({})
      .populate(
        "creator",
        "fullName avatar"
      )
      .sort({ createdAt: -1 });




    res.status(200).json({

      message: "Clips fetched successfully",

      clips,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

  }

}



// LIKE / UNLIKE CLIP
async function likeClip(req, res) {

  try {

    const { clipId } = req.body;

    const user = req.user;



    const alreadyLiked =
      await likeModel.findOne({
        user: user._id,
        clip: clipId,
      });



    if (alreadyLiked) {

      await likeModel.deleteOne({
        user: user._id,
        clip: clipId,
      });



      await clipModel.findByIdAndUpdate(
        clipId,
        {
          $inc: {
            likeCount: -1,
          },
        }
      );



      return res.status(200).json({

        message: "Clip unliked successfully",

      });

    }



    const like = await likeModel.create({

      user: user._id,

      clip: clipId,

    });



    await clipModel.findByIdAndUpdate(
      clipId,
      {
        $inc: {
          likeCount: 1,
        },
      }
    );



    res.status(201).json({

      message: "Clip liked successfully",

      like,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

  }

}



// SAVE / UNSAVE CLIP
async function saveClip(req, res) {

  try {

    const { clipId } = req.body;

    const user = req.user;



    const alreadySaved =
      await saveModel.findOne({
        user: user._id,
        clip: clipId,
      });



    if (alreadySaved) {

      await saveModel.deleteOne({
        user: user._id,
        clip: clipId,
      });



      await clipModel.findByIdAndUpdate(
        clipId,
        {
          $inc: {
            savesCount: -1,
          },
        },
        { new: true }
      );



      return res.status(200).json({

        message: "Clip unsaved successfully",

      });

    }



    const save = await saveModel.create({

      user: user._id,

      clip: clipId,

    });



    const updatedClip =
      await clipModel.findByIdAndUpdate(
        clipId,
        {
          $inc: {
            savesCount: 1,
          },
        },
        { new: true }
      );



    console.log(updatedClip);



    res.status(201).json({

      message: "Clip saved successfully",

      save,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

  }

}



// GET SAVED CLIPS
async function getSavedClips(req, res) {

  try {

    const savedClips =
      await saveModel
        .find({
          user: req.user._id,
        })

        .populate({

          path: "clip",

          populate: {

            path: "creator",

            select:
              "fullName avatar",

          },

        })

        .sort({
          createdAt: -1,
        });




    res.status(200).json({

      message:
        "Saved clips fetched successfully",

      savedClips,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

  }

}



module.exports = {

  createClip,

  getClips,

  likeClip,

  saveClip,

  getSavedClips,

};