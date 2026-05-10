const notificationModel =
  require(
    "../models/notification.model"
  )

async function getNotifications(
  req,
  res
) {

  try {

    const notifications =

      await notificationModel

        .find({

          recipient:
            req.user._id,

        })

        .populate(

          "sender",

          "name avatar"

        )

        .populate(

          "clip",

          "thumbnail gameName"

        )

        .sort({
          createdAt: -1,
        })

        const io = req.app.get("io")

    res.status(200).json({

      notifications,

    })

  } catch (err) {

    console.log(err)

    res.status(500).json({

      message:
        "Failed to fetch notifications",

    })

  }

}



module.exports = {

  getNotifications,

}