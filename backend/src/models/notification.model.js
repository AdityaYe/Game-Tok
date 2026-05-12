const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    type: {
      type: String,

      enum: ["like", "comment", "follow"],

      required: true,
    },

    clip: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Clip",
    },

    isRead: {
      type: Boolean,

      default: false,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

notificationSchema.index({
  sender: 1,
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
