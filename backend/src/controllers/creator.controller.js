const clipModel = require("../models/clip.model");


async function getCreatorById(req, res) {

  try {

    const creatorId = req.params.id;

    const creator = await creatorModel.findById(creatorId);

    if (!creator) {
      return res.status(404).json({
        message: "Creator not found",
      });
    }

    const clips = await clipModel.find({
      creator: creatorId,
    });

    res.status(200).json({
      message: "Creator retrieved successfully",

      creator: {
        ...creator.toObject(),
        clips,
      },
    });

  } catch (err) {

    res.status(500).json({
      message: "Server error",
    });

  }

}


module.exports = {
  getCreatorById,
};