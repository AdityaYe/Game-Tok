const clipModel = require("../models/clip.model");

const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const commentModel = require("../models/comment.model");

const cloudinary = require("../services/storage.service");

const streamifier = require("streamifier");

// CREATE CLIP
async function createClip(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Clip file is required",
      });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "gametok",
        },

        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const thumbnail = result.secure_url
      .replace("/upload/", "/upload/so_1/")
      .replace(".mp4", ".jpg");

    const clip = await clipModel.create({
      gameName: req.body.gameName,

      thumbnail,

      description: req.body.description,

      genre: req.body.genre,

      gameUrl: req.body.gameUrl,

      video: uploadResult.secure_url,

      creator: req.creator._id,

      likeCount: 0,

      savesCount: 0,

      tags: JSON.parse(req.body.tags || "[]"),
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
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    const clips = await clipModel

      .find()

      .populate(
        "creator",

        "name avatar isVerified",
      )

      .sort({
        createdAt: -1,
      })

      .skip(skip)

      .limit(limit);

    const totalClips = await clipModel.countDocuments();

    res.status(200).json({
      clips,

      currentPage: page,

      hasMore: skip + clips.length < totalClips,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to fetch clips",
    });
  }
}

// LIKE / UNLIKE CLIP
async function likeClip(req, res) {
  try {
    const { clipId } = req.body;

    const user = req.user;

    const alreadyLiked = await likeModel.findOne({
      user: user._id,
      clip: clipId,
    });

    if (alreadyLiked) {
      await likeModel.deleteOne({
        user: user._id,
        clip: clipId,
      });

      await clipModel.findByIdAndUpdate(clipId, {
        $inc: {
          likeCount: -1,
        },
      });

      return res.status(200).json({
        message: "Clip unliked successfully",
      });
    }

    const like = await likeModel.create({
      user: user._id,

      clip: clipId,
    });

    await clipModel.findByIdAndUpdate(clipId, {
      $inc: {
        likeCount: 1,
      },
    });

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

async function addComment(req, res) {
  try {
    const {
      clipId,

      text,
    } = req.body;

    const comment = await commentModel.create({
      clip: clipId,

      user: req.user._id,

      text,
    });

    await clipModel.findByIdAndUpdate(
      clipId,

      {
        $inc: {
          commentCount: 1,
        },
      },
    );

    res.status(201).json({
      message: "Comment added",

      comment,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to add comment",
    });
  }
}

async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;

    const comment = await commentModel.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    /* ONLY COMMENT OWNER */

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await comment.deleteOne();

    /* UPDATE COMMENT COUNT */

    await clipModel.findByIdAndUpdate(
      comment.clip,

      {
        $inc: {
          commentCount: -1,
        },
      },
    );

    res.status(200).json({
      message: "Comment deleted",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to delete comment",
    });
  }
}

async function getComments(req, res) {
  try {
    const comments = await commentModel

      .find({
        clip: req.params.clipId,
      })

      .populate("user", "fullName avatar")

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      comments,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to fetch comments",
    });
  }
}

// SAVE / UNSAVE CLIP
async function saveClip(req, res) {
  try {
    const { clipId } = req.body;

    const user = req.user;

    const alreadySaved = await saveModel.findOne({
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
        { new: true },
      );

      return res.status(200).json({
        message: "Clip unsaved successfully",
      });
    }

    const save = await saveModel.create({
      user: user._id,

      clip: clipId,
    });

    const updatedClip = await clipModel.findByIdAndUpdate(
      clipId,
      {
        $inc: {
          savesCount: 1,
        },
      },
      { new: true },
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
    const savedClips = await saveModel
      .find({
        user: req.user._id,
      })

      .populate({
        path: "clip",

        populate: {
          path: "creator",

          select: "fullName avatar",
        },
      })

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      message: "Saved clips fetched successfully",

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
  addComment,
  deleteComment,
  getComments,
};
