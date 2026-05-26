const mongoose = require("mongoose");

const clipSchema = new mongoose.Schema(
  {
    gameName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    igdbId: {
      type: Number
    },

    gameSlug: {
      type:  String,
      default: ""
    },

    gameCover: {
      type: String,
      default: ""
    },

    video: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    genre: {
      type: String,
      trim: true,
      default: "",
    },

    gameUrl: {
      type: String,
      default: "",
    },

    gameAppId: {
      type: Number,
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

    views: {
      type: Number,
      default: 0,
    },

    watchTime: {
      type: Number,
      default: 0,
    },

    trendingScore: {
      type: Number,
      default: 0,
    },

    tags: {
      type: [String],
      default: [],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

clipSchema
  .virtual("caption")
  .get(function getCaption() {
    return this.description;
  })
  .set(function setCaption(value) {
    this.description = value;
  });

clipSchema.index({ gameName: "text", tags: "text" });

clipSchema.index({ gameName: 1, createdAt: -1 });

clipSchema.index({ createdAt: -1 });

clipSchema.index({ tags: 1 });

clipSchema.index({ likeCount: -1 });

clipSchema.index({ views: -1 });

clipSchema.index({ createdAt: -1, likeCount: -1 });

clipSchema.index({ creator: 1 });

const Clip = mongoose.model("Clip", clipSchema);

module.exports = Clip;
