const notificationModel = require("../models/notification.model");

const ApiResponse = require("../utils/ApiResponse");

const { getPagination } = require("../utils/pagination");

async function getNotifications(req, res) {
  const { page, limit, skip } = getPagination(req.query);

  const notifications = await notificationModel
    .find({
      recipient: req.user._id,
    })

    .populate(
      "sender",
      `
        fullName
        avatar
        `,
    )

    .populate(
      "clip",
      `
        thumbnail
        gameName
        `,
    )

    .sort({
      createdAt: -1,
    })

    .skip(skip)

    .limit(limit)

    .lean();

  const totalNotifications = await notificationModel.countDocuments({
    recipient: req.user._id,
  });

  return res.status(200).json(
    new ApiResponse(200, "Notifications fetched successfully", {
      notifications,

      pagination: {
        page,

        limit,

        totalItems: totalNotifications,

        totalPages: Math.ceil(totalNotifications / limit),
      },
    }),
  );
}

module.exports = {
  getNotifications,
};
