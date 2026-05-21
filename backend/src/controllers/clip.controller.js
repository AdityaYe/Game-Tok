const clipModel = require("../models/clip.model");

const likeModel = require("../models/like.model");
const saveModel = require("../models/save.model");
const commentModel = require("../models/comment.model");

const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const {
  uploadClipVideo,
  generateThumbnail,
} = require("../services/storage.service");

const eventBus = require("../events/eventBus");

const { getPagination } = require("../utils/pagination");

function calculateTrendingScore(clip) {
  const likes = clip.likeCount || 0;

  const comments = clip.commentCount || 0;

  const saves = clip.savesCount || 0;

  const views = clip.views || 0;

  const ageHours = (Date.now() - new Date(clip.createdAt)) / (1000 * 60 * 60);

  const engagementScore = likes * 1 + comments * 3 + saves * 5 + views * 0.1;

  const recencyBoost = Math.max(48 - ageHours, 0);

  return engagementScore + recencyBoost;
}

function withCaption(clip) {
  return {
    ...clip,
    caption: clip.caption ?? clip.description ?? "",
  };
}

async function createClip(req, res) {
  if (!req.file) {
    throw new ApiError(400, "Clip file is required");
  }

  const uploadResult = await uploadClipVideo(req.file.buffer);

  const thumbnail = generateThumbnail(uploadResult.secure_url);

  const clip = await clipModel.create({
    gameName: req.body.gameName,

    thumbnail,

    description: req.body.caption ?? req.body.description ?? "",

    genre: req.body.genre,

    gameUrl: req.body.gameUrl,

    video: uploadResult.secure_url,

    creator: req.user._id,

    videoPublicId: uploadResult.public_id,

    tags: Array.isArray(req.body.tags) ? req.body.tags : [],
  });

  return res.status(201).json(
    new ApiResponse(201, "Clip uploaded successfully", {
      clip: withCaption(clip.toObject()),
    }),
  );
}

async function getClips(req, res) {
  const { page, limit, skip } = getPagination(req.query);

  const clips = await clipModel
    .find({
      isDeleted: {
        $ne: true,
      },
    })

    .select(
      `
        gameName
        thumbnail
        video
        description
        tags
        creator
        likeCount
        commentCount
        savesCount
        views
        createdAt
        `,
    )

    .populate(
      "creator",
      `
        fullName
        avatar
        isVerified
        `,
    )

    .sort({
      createdAt: -1,
    })

    .skip(skip)

    .limit(limit)

    .lean();

  const totalClips = await clipModel.countDocuments({
    isDeleted: {
      $ne: true,
    },
  });

  const rankedClips = clips.map(withCaption).sort(
    (a, b) => calculateTrendingScore(b) - calculateTrendingScore(a),
  );

  return res.status(200).json(
    new ApiResponse(200, "Clips fetched successfully", {
      clips: rankedClips,

      pagination: {
        page,

        limit,

        totalItems: totalClips,

        totalPages: Math.ceil(totalClips / limit),

        hasMore: skip + clips.length < totalClips,
      },
    }),
  );
}

async function likeClip(req, res) {
  const { clipId } = req.params;

  const existingLike = await likeModel.findOne({
    user: req.user._id,

    clip: clipId,
  });

  const clip = await clipModel.findById(clipId);

  if (!clip) {
    throw new ApiError(404, "Clip not found");
  }

  if (existingLike) {
    await existingLike.deleteOne();

    await clipModel.findByIdAndUpdate(clipId, {
      $inc: {
        likeCount: -1,
      },
    });

    return res.status(200).json(
      new ApiResponse(200, "Clip unliked successfully", {
        liked: false,
      }),
    );
  }

  await likeModel.create({
    user: req.user._id,

    clip: clipId,
  });

  await clipModel.findByIdAndUpdate(clipId, {
    $inc: {
      likeCount: 1,
    },
  });

  if (clip.creator.toString() !== req.user._id.toString()) {
    eventBus.emit("notification:create", {
      recipient: clip.creator,
      sender: req.user._id,
      type: "like",
      clip: clip._id,
      senderName: req.user.fullName,
    });
  }

  return res.status(201).json(
    new ApiResponse(201, "Clip liked successfully", {
      liked: true,
    }),
  );
}

async function addComment(req, res) {
  const { clipId } = req.params;
  const { text } = req.body;

  const clip = await clipModel.findById(clipId);

  if (!clip) {
    throw new ApiError(404, "Clip not found");
  }

  const comment = await commentModel.create({
    clip: clipId,

    user: req.user._id,

    text,
  });

  await clipModel.findByIdAndUpdate(clipId, {
    $inc: {
      commentCount: 1,
    },
  });

  if (clip.creator.toString() !== req.user._id.toString()) {
    eventBus.emit("notification:create", {
      recipient: clip.creator,
      sender: req.user._id,
      type: "comment",
      clip: clip._id,
      senderName: req.user.fullName,
    });
  }

  return res.status(201).json(
    new ApiResponse(201, "Comment added successfully", {
      comment,
    }),
  );
}

async function deleteComment(req, res) {
  const { commentId } = req.params;

  const comment = await commentModel.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  comment.isDeleted = true;

  await comment.save();

  await clipModel.findByIdAndUpdate(comment.clip, {
    $inc: {
      commentCount: -1,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment deleted successfully"));
}

async function getComments(req, res) {
  const { page, limit, skip } = getPagination(req.query);

  const comments = await commentModel
    .find({
      clip: req.params.clipId,

      isDeleted: {
        $ne: true,
      },
    })

    .populate(
      "user",
      `
        fullName
        avatar
        `,
    )

    .sort({
      createdAt: -1,
    })

    .skip(skip)

    .limit(limit)

    .lean();

  const totalComments = await commentModel.countDocuments({
    clip: req.params.clipId,

    isDeleted: {
      $ne: true,
    },
  });

  return res.status(200).json(
    new ApiResponse(200, "Comments fetched successfully", {
      comments,

      pagination: {
        page,

        limit,

        totalItems: totalComments,

        totalPages: Math.ceil(totalComments / limit),
      },
    }),
  );
}

async function saveClip(req, res) {
  const { clipId } = req.params;

  const existingSave = await saveModel.findOne({
    user: req.user._id,

    clip: clipId,
  });

  if (existingSave) {
    await existingSave.deleteOne();

    await clipModel.findByIdAndUpdate(clipId, {
      $inc: {
        savesCount: -1,
      },
    });

    return res.status(200).json(
      new ApiResponse(200, "Clip unsaved successfully", {
        saved: false,
      }),
    );
  }

  await saveModel.create({
    user: req.user._id,

    clip: clipId,
  });

  await clipModel.findByIdAndUpdate(clipId, {
    $inc: {
      savesCount: 1,
    },
  });

  return res.status(201).json(
    new ApiResponse(201, "Clip saved successfully", {
      saved: true,
    }),
  );
}

async function getSavedClips(req, res) {
  const { page, limit, skip } = getPagination(req.query);

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
    })

    .skip(skip)

    .limit(limit)

    .lean();

  const totalSaved = await saveModel.countDocuments({
    user: req.user._id,
  });

  return res.status(200).json(
    new ApiResponse(200, "Saved clips fetched successfully", {
      savedClips,

      pagination: {
        page,

        limit,

        totalItems: totalSaved,

        totalPages: Math.ceil(totalSaved / limit),
      },
    }),
  );
}

async function trackView(req, res) {
  const { clipId } = req.params;

  await clipModel.findByIdAndUpdate(clipId, {
    $inc: {
      views: 1,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "View tracked successfully"));
}

async function trackWatchTime(req, res) {
  const { clipId } = req.params;
  const { seconds = 0 } = req.body;

  await clipModel.findByIdAndUpdate(clipId, {
    $inc: {
      watchTime: seconds,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Watch time tracked successfully"));
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
  trackView,
  trackWatchTime,
};
