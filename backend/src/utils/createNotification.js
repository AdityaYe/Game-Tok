const notificationModel = require("../models/notification.model");
const io = global.io;

async function createNotification({
  recipient,
  sender,
  type,
  clip = null,
}) {
  if (recipient.toString() === sender.toString()) {
    return;
  }

  await notificationModel.create({
    recipient,
    sender,
    type,
    clip,
  });
}

module.exports = createNotification;
