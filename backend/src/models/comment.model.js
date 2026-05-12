const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    clip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clip",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

commentSchema.index({
  clip: 1,
  createdAt: -1,
});

commentSchema.index({
  user: 1,
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
