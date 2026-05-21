const clipModel = require("../models/clip.model");

const userModel = require("../models/user.model");

const cache = require("../services/cache.service");

const ApiResponse = require("../utils/ApiResponse");

const { getTrendingTags } = require("../services/search.service");

async function searchAll(req, res) {
  const query = req.query.q?.trim() || "";

  if (!query) {
    return res.status(200).json(
      new ApiResponse(
        200,

        "Search results fetched successfully",

        {
          creators: [],
          clips: [],
          tags: [],
        },
      ),
    );
  }

  const cacheKey = `search:${query}`;

  const cachedResults = cache.get(cacheKey);

  if (cachedResults) {
    return res.status(200).json(
      new ApiResponse(
        200,

        "Search results fetched successfully",

        cachedResults,
      ),
    );
  }

  /* SEARCH CREATORS */

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

  /* SEARCH CLIPS */

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

  /* SEARCH TAGS */

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

  const responseData = {
    creators,
    clips,
    tags,
  };

  /* CACHE SEARCH */

  cache.set(cacheKey, responseData, 60);

  res.set(
    "Cache-Control",

    "public, max-age=60",
  );

  return res.status(200).json(
    new ApiResponse(
      200,

      "Search results fetched successfully",

      responseData,
    ),
  );
}

async function getTrendingTagsController(req, res) {
  const cachedTags = cache.get("trending-tags");

  if (cachedTags) {
    return res.status(200).json(
      new ApiResponse(
        200,

        "Trending tags fetched successfully",

        {
          tags: cachedTags,
        },
      ),
    );
  }

  const tags = await getTrendingTags();

  cache.set("trending-tags", tags, 300);

  res.set(
    "Cache-Control",

    "public, max-age=300",
  );

  return res.status(200).json(
    new ApiResponse(
      200,

      "Trending tags fetched successfully",

      {
        tags,
      },
    ),
  );
}

module.exports = {
  searchAll,

  getTrendingTags: getTrendingTagsController,
};

