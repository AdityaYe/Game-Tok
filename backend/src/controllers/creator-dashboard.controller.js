const clipModel = require("../models/clip.model");

const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const { getCreatorStats } = require("../services/dashboard.service");

const { getPagination } = require("../utils/pagination");

async function getCreatorDashboard(req, res) {
  const creatorId = req.user._id;

  const { page, limit, skip } = getPagination(req.query);

  const clips = await clipModel
    .find({
      creator: creatorId,

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
        likeCount
        commentCount
        savesCount
        views
        watchTime
        createdAt
        `,
    )

    .sort({
      createdAt: -1,
    })

    .skip(skip)

    .limit(limit)

    .lean();

  const totalClipCount = await clipModel.countDocuments({
    creator: creatorId,

    isDeleted: {
      $ne: true,
    },
  });

  const stats = await getCreatorStats(creatorId);

  const engagementRate =
    stats.totalViews > 0
      ? ((stats.totalLikes + stats.totalSaves) / stats.totalViews) * 100
      : 0;

  return res.status(200).json(
    new ApiResponse(200, "Dashboard fetched successfully", {
      creator: {
        _id: req.user._id,

        fullName: req.user.fullName,

        avatar: req.user.avatar,

        bio: req.user.bio,

        banner: req.user.banner,

        socials: req.user.socials,

        isVerified: req.user.isVerified,
      },

      clips,

      stats: {
        totalClips: stats.totalClips,

        followerCount: req.user.followerCount,

        followingCount: req.user.followingCount,

        totalLikes: stats.totalLikes,

        totalSaves: stats.totalSaves,

        totalViews: stats.totalViews,

        totalWatchTime: stats.totalWatchTime,

        engagementRate: Number(engagementRate.toFixed(2)),
      },

      pagination: {
        page,

        limit,

        totalItems: totalClipCount,

        totalPages: Math.ceil(totalClipCount / limit),
      },
    }),
  );
}

async function updateClip(req, res) {
  const { clipId } = req.params;

  const { gameName, description, tags } = req.body;

  const clip = await clipModel.findOne({
    _id: clipId,

    creator: req.user._id,

    isDeleted: {
      $ne: true,
    },
  });

  if (!clip) {
    throw new ApiError(404, "Clip not found");
  }

  if (gameName) {
    clip.gameName = gameName;
  }

  if (description) {
    clip.description = description;
  }

  if (tags) {
    clip.tags = tags;
  }

  await clip.save();

  return res.status(200).json(
    new ApiResponse(200, "Clip updated successfully", {
      clip,
    }),
  );
}

async function deleteClip(req, res) {
  const { clipId } = req.params;

  const clip = await clipModel.findOne({
    _id: clipId,

    creator: req.user._id,

    isDeleted: {
      $ne: true,
    },
  });

  if (!clip) {
    throw new ApiError(404, "Clip not found");
  }

  clip.isDeleted = true;

  await clip.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Clip deleted successfully"));
}

module.exports = {
  getCreatorDashboard,

  updateClip,

  deleteClip,
};
