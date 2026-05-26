const clipModel = require("../models/clip.model");

const likeModel = require("../models/like.model");

const commentModel = require("../models/comment.model");

async function getFeed({ page = 1, limit = 10 }) {
  const skip = (page - 1) * limit;

  const clips = await clipModel
    .find({isDeleted: {$ne: true,},})
    
    .select(`gameName
        gameCover
        gameUrl
        gameAppId
        igdbId
        thumbnail
        video
        creator
        likeCount
        commentCount
        savesCount
        views
        createdAt
        `
      )

    .populate(
        "creator",
        "fullName avatar isVerified"
    )
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit)
    .lean();

  return clips;
}

async function updateClipStats(clipId, updateData) {
  return clipModel.findByIdAndUpdate(clipId, updateData, {
    new: true,
  });
}

async function addComment({ clipId, userId, text }) {
  const comment = await commentModel.create({
    clip: clipId,
    user: userId,
    text,
  });

  await clipModel.findByIdAndUpdate(clipId, {
    $inc: {
      commentCount: 1,
    },
  });

  return comment;
}

async function toggleLike({ clipId, userId }) {
  const existingLike = await likeModel.findOne({
    user: userId,
    clip: clipId,
  });

  if (existingLike) {
    await existingLike.deleteOne();

    await clipModel.findByIdAndUpdate(clipId, {
      $inc: {
        likeCount: -1,
      },
    });

    return {
      liked: false,
    };
  }

  await likeModel.create({
    user: userId,
    clip: clipId,
  });

  await clipModel.findByIdAndUpdate(clipId, {
    $inc: {
      likeCount: 1,
    },
  });

  return {
    liked: true,
  };
}

module.exports = {
  getFeed,
  updateClipStats,
  addComment,
  toggleLike,
};
