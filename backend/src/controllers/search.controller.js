const clipModel = require("../models/clip.model");

const userModel = require("../models/user.model");

const ApiResponse = require("../utils/ApiResponse");

const { getTrendingTags } = require("../services/search.service");

async function searchAll(req, res) {
  const query = req.query.q?.trim() || "";

  if (!query) {
    return res.status(200).json(
      new ApiResponse(200, "Search results fetched successfully", {
        creators: [],
        clips: [],
        tags: [],
      }),
    );
  }

  const creators = await userModel
    .find({
      $text: {
        $search: query,
      },

      isDeleted: {
        $ne: true,
      },
    })

    .select(
      `
        fullName
        avatar
        isVerified
        `,
    )

    .limit(5)

    .lean();

  const clips = await clipModel
    .find({
      $text: {
        $search: query,
      },

      isDeleted: {
        $ne: true,
      },
    })

    .select(
      `
        gameName
        thumbnail
        `,
    )

    .limit(5)

    .lean();

  const tagClips = await clipModel
    .find({
      tags: {
        $regex: query,
        $options: "i",
      },

      isDeleted: {
        $ne: true,
      },
    })

    .select("tags")

    .lean();

  const tags = [...new Set(tagClips.flatMap((clip) => clip.tags))];

  return res.status(200).json(
    new ApiResponse(200, "Search results fetched successfully", {
      creators,
      clips,
      tags,
    }),
  );
}

async function getTrendingTagsController(req, res) {
  const tags = await getTrendingTags();

  return res.status(200).json(
    new ApiResponse(200, "Trending tags fetched successfully", {
      tags,
    }),
  );
}

module.exports = {
  searchAll,

  getTrendingTags: getTrendingTagsController,
};
