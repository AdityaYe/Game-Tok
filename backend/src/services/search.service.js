const clipModel = require("../models/clip.model");

async function getTrendingTags() {
  const tags = await clipModel.aggregate([
    {
      $unwind: "$tags",
    },

    {
      $group: {
        _id: "$tags",

        count: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        count: -1,
      },
    },

    {
      $limit: 10,
    },
  ]);

  return tags;
}

module.exports = {
  getTrendingTags,
};
