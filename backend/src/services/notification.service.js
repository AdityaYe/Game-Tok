const notificationModel = require(
  "../models/notification.model"
);

async function createNotification({
  recipient,
  sender,
  type,
  clip = null,
}) {

  return notificationModel.create({
    recipient,
    sender,
    type,
    clip,
  });
}

module.exports = {
  createNotification,
};