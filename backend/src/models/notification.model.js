const mongoose =
  require("mongoose")



const notificationSchema =

  new mongoose.Schema(

    {

      recipient: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "user",

        required: true,

      },



      sender: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "user",

        required: true,

      },



      type: {

        type: String,

        enum: [

          "like",

          "comment",

          "follow",

        ],

        required: true,

      },



      clip: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "clip",

      },



      isRead: {

        type: Boolean,

        default: false,

      },

    },

    {

      timestamps: true,

    }

  )



const notificationModel =

  mongoose.model(

    "notification",

    notificationSchema

  )



module.exports =
  notificationModel