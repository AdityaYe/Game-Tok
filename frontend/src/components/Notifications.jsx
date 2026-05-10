import React, { useEffect, useState } from "react";

import axios from "axios";

import "../styles/notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    socket.on(
      "new_notification",

      (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      },
    );

    return () => {
      socket.off("new_notification");
    };
  }, []);

  async function fetchNotifications() {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/notifications",

        {
          withCredentials: true,
        },
      );

      setNotifications(response.data.notifications || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

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
                    src={notification.sender.avatar}
                    alt={notification.sender.name}
                  />
                ) : (
                  notification.sender?.name?.[0]
                )}
              </div>

              <div className="notification-content">
                <div className="notification-text">
                  <strong>@{notification.sender?.name}</strong>{" "}
                  {getNotificationText(notification)}
                </div>

                <div className="notification-time">
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </div>

              {notification.clip?.thumbnail && (
                <img
                  src={notification.clip.thumbnail}
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
