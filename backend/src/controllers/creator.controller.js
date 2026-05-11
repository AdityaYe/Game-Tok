const userModel = require("../models/user.model");

const clipModel = require("../models/clip.model");

const ApiError = require("../utils/ApiError");

const ApiResponse = require("../utils/ApiResponse");

const {
  uploadAvatar,
  uploadBanner,
  deleteMedia,
} = require("../services/storage.service");

const eventbus = require("../events/eventBus");

const { getPagination } = require("../utils/pagination");

async function getCreatorById(req, res) {
  const creatorId = req.params.id;

  const { page, limit, skip } = getPagination(req.query);

  const creator = await userModel
    .findById(creatorId)

    .select(
      `
        fullName
        avatar
        banner
        bio
        socials
        followerCount
        followingCount
        isVerified
        `,
    )

    .lean();

  if (!creator) {
    throw new ApiError(404, "Creator not found");
  }

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
        createdAt
        `,
    )

    .sort({
      createdAt: -1,
    })

    .skip(skip)

    .limit(limit)

    .lean();

  const totalClips = await clipModel.countDocuments({
    creator: creatorId,

    isDeleted: {
      $ne: true,
    },
  });

  return res.status(200).json(
    new ApiResponse(200, "Creator retrieved successfully", {
      creator,

      clips,

      pagination: {
        page,

        limit,

        totalItems: totalClips,

        totalPages: Math.ceil(totalClips / limit),
      },
    }),
  );
}

async function updateAvatar(req, res) {
  if (!req.file) {
    throw new ApiError(400, "Avatar required");
  }

  if (req.user.avatarPublicId) {
    await deleteMedia(req.user.avatarPublicId);
  }

  const uploadResult = await uploadAvatar(req.file.buffer);

  req.user.avatar = uploadResult.secure_url;

  req.user.avatarPublicId = uploadResult.public_id;

  await req.user.save();

  return res.status(200).json(
    new ApiResponse(200, "Avatar updated successfully", {
      avatar: req.user.avatar,
    }),
  );
}

async function updateBanner(req, res) {
  if (!req.file) {
    throw new ApiError(400, "Banner required");
  }

  if (req.user.bannerPublicId) {
    await deleteMedia(req.user.bannerPublicId);
  }

  const uploadResult = await uploadBanner(req.file.buffer);

  req.user.banner = uploadResult.secure_url;

  req.user.bannerPublicId = uploadResult.public_id;

  await req.user.save();

  return res.status(200).json(
    new ApiResponse(200, "Banner updated successfully", {
      banner: req.user.banner,
    }),
  );
}

async function followCreator(req, res) {
  const { creatorId } = req.body;

  const userId = req.user._id;

  if (creatorId === userId.toString()) {
    throw new ApiError(400, "Cannot follow yourself");
  }

  const creator = await userModel.findById(creatorId);

  const user = await userModel.findById(userId);

  if (!creator || !user) {
    throw new ApiError(404, "User not found");
  }

  const alreadyFollowing = creator.followers.some(
    (id) => id.toString() === userId.toString(),
  );

  if (alreadyFollowing) {
    creator.followers = creator.followers.filter(
      (id) => id.toString() !== userId.toString(),
    );

    user.following = user.following.filter((id) => id.toString() !== creatorId);

    creator.followerCount = Math.max(0, creator.followerCount - 1);

    user.followingCount = Math.max(0, user.followingCount - 1);

    await creator.save();

    await user.save();

    return res.status(200).json(
      new ApiResponse(200, "Creator unfollowed", {
        following: false,
      }),
    );
  }

  creator.followers.push(userId);

  user.following.push(creatorId);

  creator.followerCount += 1;

  user.followingCount += 1;

  await creator.save();

  await user.save();

  eventBus.emit("notification:create", {
    recipient: clip.creator,
    sender: req.user._id,
    type: "like",
    clip: clip._id,
    senderName: req.user.fullName,
  });

  return res.status(200).json(
    new ApiResponse(200, "Creator followed successfully", {
      following: true,
    }),
  );
}

module.exports = {
  getCreatorById,

  updateAvatar,

  updateBanner,

  followCreator,
};
