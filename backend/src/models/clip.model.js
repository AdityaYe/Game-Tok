const mongoose = require("mongoose");

const clipSchema = new mongoose.Schema(
  {
    gameName: {
      type: String,
      required: true,
    },

    video: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
    },

    description: {
      type: String,
    },

    genre: {
      type: String,
    },

    gameUrl: {
      type: String,
    },

    gameAppId: {
      type: Number,
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    likeCount: {
      type: Number,
      default: 0,
    },

    commentCount: {
        type: Number,
        default: 0,
    },

    savesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

clipSchema.index({ gameName: "text" });

const clipModel = mongoose.model("clip", clipSchema);

module.exports = clipModel;