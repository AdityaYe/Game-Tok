const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    igdbId: {
      type: Number,
      unique: true,
      sparse: true,
    },

    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
    },

    genre: {
      type: String,
    },

    cover: {
      type: String,
    },

    rating: {
      type: Number,
    },

    website: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

gameSchema.index({ name: 1 });

const gameModel = mongoose.model("game", gameSchema);

module.exports = gameModel;
