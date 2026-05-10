const clipModel = require("../models/clip.model");

const userModel = require("../models/user.model");

async function searchAll(req, res) {
  try {
    const query = req.query.q || "";

    if (!query.trim()) {
      return res.status(200).json({
        creators: [],

        clips: [],

        tags: [],
      });
    }

    /* SEARCH CREATORS */

    const creators = await userModel
      .find({
        name: {
          $regex: query,

          $options: "i",
        },
      })

      .select("name avatar isVerified")

      .limit(5);

    /* SEARCH CLIPS */

    const clips = await clipModel
      .find({
        gameName: {
          $regex: query,

          $options: "i",
        },
      })

      .select("gameName thumbnail")

      .limit(5);

    /* SEARCH TAGS */

    const tagClips = await clipModel
      .find({
        tags: {
          $regex: query,

          $options: "i",
        },
      })

      .select("tags");

    const tags = [...new Set(tagClips.flatMap((clip) => clip.tags))];

    res.status(200).json({
      creators,

      clips,

      tags,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Search failed",
    });
  }
}

async function getTrendingTags(req, res) {
  try {
    const clips = await clipModel.find();

    const tagMap = {};

    clips.forEach((clip) => {
      (clip.tags || []).forEach((tag) => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });

    const trendingTags = Object.entries(tagMap)

      .sort((a, b) => b[1] - a[1])

      .slice(0, 10);

    res.status(200).json({
      tags: trendingTags,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to fetch tags",
    });
  }
}

module.exports = {
  searchAll,
  getTrendingTags
};
