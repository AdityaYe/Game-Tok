const userService = require("../services/user.service");

const ApiResponse = require("../utils/ApiResponse");

async function followUser(req, res) {
  const result = await userService.followUser({
    currentUserId: req.user._id,
    targetUserId: req.params.id,
  });

  return res.status(200).json(
    new ApiResponse(200, "User followed successfully", result),
  );
}

async function unfollowUser(req, res) {
  const result = await userService.unfollowUser({
    currentUserId: req.user._id,
    targetUserId: req.params.id,
  });

  return res.status(200).json(
    new ApiResponse(200, "User unfollowed successfully", result),
  );
}

module.exports = {
  followUser,
  unfollowUser,
};
