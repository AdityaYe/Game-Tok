const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {

    igdbId: {
      type: Number,
      unique: true,
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

    tags: [
      {
        type: String,
      }
    ],

    gameCover: {
        type: String,
    },
    
    gameRating: {
        type: Number,
    },

  },
  {
    timestamps: true,
  }
);

const gameModel =
  mongoose.model("game", gameSchema);

module.exports = gameModel;