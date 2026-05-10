const userModel = require("../models/user.model");
const clipModel = require("../models/clip.model");

async function getCreatorById(req, res) {
  try {
    const creatorId = req.params.id;

    const cloudinary = require("../config/cloudinary");

    const streamifier = require("streamifier");

    const creator = await userModel

      .findById(req.params.id)

      .populate("followers", "name avatar")
      .populate("following", "name avatar");

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

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "gametok-avatars",
        },

        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      streamifier

        .createReadStream(req.file.buffer)

        .pipe(stream);
    });

    req.creator.avatar = uploadResult.secure_url;

    await req.creator.save();

    res.status(200).json({
      message: "Avatar updated successfully",

      avatar: req.creator.avatar,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to update avatar",
    });
  }
}

async function followCreator(req, res) {
  try {
    const { creatorId } = req.body;

    const userId = req.user._id;

    if (creatorId === userId.toString()) {
      return res.status(400).json({
        message: "Cannot follow yourself",
      });
    }

    const creator = await userModel.findById(creatorId);

    const user = await userModel.findById(userId);

    if (!creator || !user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyFollowing = creator.followers.includes(userId);

    if (alreadyFollowing) {
      /* UNFOLLOW */

      creator.followers = creator.followers.filter(
        (id) => id.toString() !== userId.toString(),
      );

      user.following = user.following.filter(
        (id) => id.toString() !== creatorId,
      );

      await creator.save();

      await user.save();

      return res.status(200).json({
        following: false,
      });
    }

    /* FOLLOW */

    creator.followers.push(userId);

    user.following.push(creatorId);

    await creator.save();

    await user.save();

    await createNotification({
      recipient: creatorId,
      sender: req.user._id,
      type: "follow",
    });

    io.to(clip.creator.toString()).emit(
      "new_notification",
      {
        type: "like",
        sender: req.user.name,
      },
    );

    res.status(200).json({
      following: true,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to follow creator",
    });
  }
}

async function updateBanner(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Banner required",
      });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "gametok-banners",
        },

        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      streamifier

        .createReadStream(req.file.buffer)

        .pipe(stream);
    });

    req.creator.banner = uploadResult.secure_url;

    await req.creator.save();

    res.status(200).json({
      banner: req.creator.banner,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to upload banner",
    });
  }
}

module.exports = {
  getCreatorById,
  updateAvatar,
  updateBanner,
  followCreator,
};
