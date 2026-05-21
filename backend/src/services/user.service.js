const userModel = require("../models/user.model");

const ApiError = require("../utils/ApiError");

async function followUser({ currentUserId, targetUserId }) {
  if (currentUserId.toString() === targetUserId.toString()) {
    throw new ApiError(400, "Cannot follow yourself");
  }

  const targetUser = await userModel.findById(targetUserId);
  const currentUser = await userModel.findById(currentUserId);

  if (!targetUser || !currentUser) {
    throw new ApiError(404, "User not found");
  }

  const alreadyFollowing = targetUser.followers.some(
    (id) => id.toString() === currentUserId.toString(),
  );

  if (alreadyFollowing) {
    return {
      following: true,
      followerCount: targetUser.followerCount,
      followingCount: currentUser.followingCount,
    };
  }

  targetUser.followers.push(currentUserId);
  currentUser.following.push(targetUserId);
  targetUser.followerCount += 1;
  currentUser.followingCount += 1;

  await targetUser.save();
  await currentUser.save();

  return {
    following: true,
    followerCount: targetUser.followerCount,
    followingCount: currentUser.followingCount,
  };
}

async function unfollowUser({ currentUserId, targetUserId }) {
  if (currentUserId.toString() === targetUserId.toString()) {
    throw new ApiError(400, "Cannot unfollow yourself");
  }

  const targetUser = await userModel.findById(targetUserId);
  const currentUser = await userModel.findById(currentUserId);

  if (!targetUser || !currentUser) {
    throw new ApiError(404, "User not found");
  }

  const wasFollowing = targetUser.followers.some(
    (id) => id.toString() === currentUserId.toString(),
  );

  if (!wasFollowing) {
    return {
      following: false,
      followerCount: targetUser.followerCount,
      followingCount: currentUser.followingCount,
    };
  }

  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== currentUserId.toString(),
  );
  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== targetUserId.toString(),
  );
  targetUser.followerCount = Math.max(0, targetUser.followerCount - 1);
  currentUser.followingCount = Math.max(0, currentUser.followingCount - 1);

  await targetUser.save();
  await currentUser.save();

  return {
    following: false,
    followerCount: targetUser.followerCount,
    followingCount: currentUser.followingCount,
  };
}

module.exports = {
  followUser,
  unfollowUser,
};
