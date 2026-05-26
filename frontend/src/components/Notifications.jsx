import React, { useCallback, useEffect } from "react";

import "../styles/notifications.css";
import { useQueryClient } from "@tanstack/react-query";
import {
  useMarkNotificationsRead,
  useNotifications,
} from "../features/notifications/hooks/useNotifications";
import { useNotificationsSocket } from "../features/notifications/hooks/useNotificationsSocket";
import { optimizeImage } from "../utils/cloudinary";

const Notifications = () => {
  const queryClient = useQueryClient();
  const { data, isLoading: loading } = useNotifications();
  const {
    isPending: isMarkingRead,
    mutate: markNotificationsRead,
  } = useMarkNotificationsRead();
  const notifications = data?.notifications || [];

  const handleNotification = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  useNotificationsSocket(handleNotification);

  useEffect(() => {
    if ((data?.unreadCount || 0) > 0 && !isMarkingRead) {
      markNotificationsRead();
    }
  }, [data?.unreadCount, isMarkingRead, markNotificationsRead]);

  function getNotificationText(notification) {
    switch (notification.type) {
      case "like":
        return "liked your clip";

      case "comment":
        return "commented on your clip";

      case "follow":
        return "started following you";

      default:
        return "interacted with you";
    }
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1 className="notifications-title">Notifications</h1>

        <p className="notifications-subtitle">
          Stay updated with activity on your content.
        </p>
      </div>

      {loading ? (
        <div className="notifications-loading">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="notifications-empty">No notifications yet.</div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div key={notification._id} className="notification-card">
              <div className="notification-avatar">
                {notification.sender?.avatar ? (
                  <img
                    src={optimizeImage(notification.sender.avatar, 800)}
                    loading="lazy"
                    alt={notification.sender.fullName}
                  />
                ) : (
                  notification.sender?.fullName?.[0]
                )}
              </div>

              <div className="notification-content">
                <div className="notification-text">
                  <strong>@{notification.sender?.fullName}</strong>{" "}
                  {getNotificationText(notification)}
                </div>

                <div className="notification-time">
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </div>

              {notification.clip?.thumbnail && (
                <img
                  src={optimizeImage(notification.clip.thumbnail, 800)}
                  loading="lazy"
                  alt={notification.clip.gameName}
                  className="notification-clip-thumbnail"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
