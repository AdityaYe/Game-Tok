const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    clip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clip",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const likeModel = mongoose.model("like", likeSchema);

module.exports = likeModel;