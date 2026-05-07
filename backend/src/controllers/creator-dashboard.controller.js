const clipModel = require("../models/clip.model");



async function getCreatorDashboard(req, res) {

  try {

    const creatorId = req.creator._id;



    const clips = await clipModel.find({
      creator: creatorId,
    });



    const totalLikes = clips.reduce(
      (sum, clip) => sum + (clip.likeCount || 0),
      0
    );



    const totalSaves = clips.reduce(
      (sum, clip) => sum + (clip.savesCount || 0),
      0
    );



    res.status(200).json({

      clips,

      stats: {
        totalClips: clips.length,
        totalLikes,
        totalSaves,
      },

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to fetch dashboard",
    });

  }

}

async function updateClip(req, res) {

  try {

    const { clipId } = req.params;



    const clip = await clipModel.findOne({

      _id: clipId,

      creator: req.creator._id,

    });



    if (!clip) {

      return res.status(404).json({
        message: "Clip not found",
      });

    }



    const {
      gameName,
      description,
      tags,

    } = req.body;

    clip.gameName =
      gameName || clip.gameName;

    clip.description =
      description || clip.description;



    clip.tags =
      tags || clip.tags;



    await clip.save();



    res.status(200).json({

      message:
        "Clip updated successfully",

      clip,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to update clip",
    });

  }

}

async function deleteClip(req, res) {

  try {

    const { clipId } = req.params;



    const clip = await clipModel.findOne({
      _id: clipId,
      creator: req.creator._id,
    });



    if (!clip) {

      return res.status(404).json({
        message: "Clip not found",
      });

    }



    await clip.deleteOne();



    res.status(200).json({
      message: "Clip deleted successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to delete clip",
    });

  }

}



module.exports = {
  getCreatorDashboard,
  updateClip,
  deleteClip,
};