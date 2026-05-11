const clipModel = require(
  "../models/clip.model"
);

async function getCreatorStats(
  creatorId
) {

  const stats =
    await clipModel.aggregate([
      {
        $match: {
          creator: creatorId,
        },
      },

      {
        $group: {
          _id: null,

          totalViews: {
            $sum: "$views",
          },

          totalLikes: {
            $sum: "$likeCount",
          },

          totalSaves: {
            $sum: "$savesCount",
          },

          totalWatchTime: {
            $sum: "$watchTime",
          },

          totalClips: {
            $sum: 1,
          },
        },
      },
    ]);

  return (
    stats[0] || {
      totalViews: 0,
      totalLikes: 0,
      totalSaves: 0,
      totalWatchTime: 0,
      totalClips: 0,
    }
  );
}

module.exports = {
  getCreatorStats,
};