const eventBus = require("./eventBus");

const { createNotification } = require("../services/notification.service");
const logger = require("../config/logger");

function registerNotificationEvents(io) {
  eventBus.on(
    "notification:create",
    async ({ recipient, sender, type, clip = null, senderName }) => {
      try {
        await createNotification({
          recipient,
          sender,
          type,
          clip,
        });

        io.to(`user:${recipient.toString()}`).emit("new_notification", {
          type,
          sender: senderName,
        });
      } catch (err) {
        logger.error("Notification event error:", err);
      }
    },
  );
}

module.exports = {
  registerNotificationEvents,
};
