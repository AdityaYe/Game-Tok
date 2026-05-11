const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    clip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clip",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

likeSchema.index(
  {
    user: 1,
    clip: 1,
  },
  {
    unique: true,
  },
);

likeSchema.index({
  clip: 1,
});

likeSchema.index({
  user: 1,
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
