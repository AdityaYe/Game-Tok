const clipModel = require("../models/clip.model");

async function getCreatorDashboard(req, res) {
  try {
    const creatorId = req.creator._id;

    const clips = await clipModel.find({
      creator: creatorId,
    });

    const totalLikes = clips.reduce(
      (sum, clip) => sum + (clip.likeCount || 0),

      0,
    );

    const totalSaves = clips.reduce(
      (sum, clip) => sum + (clip.savesCount || 0),

      0,
    );

    const totalViews = clips.reduce(
      (sum, clip) => sum + (clip.views || 0),

      0,
    );

    const totalWatchTime = clips.reduce(
      (sum, clip) => sum + (clip.watchTime || 0),

      0,
    );

    const engagementRate =
      totalViews > 0 ? ((totalLikes + totalSaves) / totalViews) * 100 : 0;

    res.status(200).json({
      creator: {
        _id: req.creator._id,

        name: req.creator.name,

        avatar: req.creator.avatar,

        bio: req.creator.bio,

        banner: req.creator.banner,

        socials: req.creator.socials,

        isVerified: req.creator.isVerified,
      },

      clips,

      stats: {
        totalClips: clips.length,

        followerCount: req.creator.followers?.length || 0,

        followingCount: req.creator.following?.length || 0,

        totalLikes,

        totalSaves,

        totalViews,

        totalWatchTime,

        engagementRate,
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

    const {
      gameName,

      description,

      tags,
    } = req.body;

    const clip = await clipModel.findOne({
      _id: clipId,

      creator: req.creator._id,
    });

    if (!clip) {
      return res.status(404).json({
        message: "Clip not found",
      });
    }

    clip.gameName = gameName || clip.gameName;

    clip.description = description || clip.description;

    clip.tags = tags || [];

    await clip.save();

    res.status(200).json({
      message: "Clip updated successfully",

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
