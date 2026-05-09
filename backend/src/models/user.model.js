const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isCreator: {
      type: Boolean,
      default: false,
    },

    avatar: {
      type: String,
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: "user",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,

        ref: "user",
      },
    ],

    bio: {
  type: String,
  default: "",
},

banner: {
  type: String,
  default: "",
},

socials: {

  youtube: {
    type: String,
    default: "",
  },

  twitch: {
    type: String,
    default: "",
  },

  twitter: {
    type: String,
    default: "",
  },

  instagram: {
    type: String,
    default: "",
  },

},
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
