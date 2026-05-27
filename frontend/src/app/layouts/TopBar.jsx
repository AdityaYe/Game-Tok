import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaSearch } from "react-icons/fa";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../../store/authStore";
import { useNotifications } from "../../features/notifications/hooks/useNotifications";
import { useNotificationsSocket } from "../../features/notifications/hooks/useNotificationsSocket";
import { useOverlayVisibility } from "../context/useOverlayVisibility";

const TopBar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const { controlsVisible, revealControls } = useOverlayVisibility();
  const { data: notificationsData } = useNotifications({
    enabled: !!user,
    staleTime: 30_000,
  });
  const unreadCount = notificationsData?.unreadCount || 0;
  const badgeLabel = unreadCount > 99 ? "99+" : unreadCount > 9 ? "9+" : unreadCount;

  const handleNotification = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["notifications"],
    });
  }, [queryClient]);

  useNotificationsSocket(handleNotification);

  return (
    <header
      className={`top-bar ${controlsVisible ? "is-controls-visible is-active" : "is-idle"}`}
      onMouseMove={revealControls}
      onTouchStart={revealControls}
    >
      <Link to="/" className="top-bar__brand" aria-label="GameTok home">
        <span className="top-bar__mark">GT</span>
        <span className="top-bar__title">GameTok</span>
      </Link>

      <div className="top-bar__actions">
        <button
          type="button"
          className="top-bar__icon-btn"
          aria-label="Search"
          onClick={() => navigate("/search")}
        >
          <FaSearch />
        </button>

        {user ? (
          <>
            <button
              type="button"
              className="top-bar__icon-btn top-bar__notification-btn"
              aria-label="Notifications"
              onClick={() => navigate("/notifications")}
            >
              <FaBell />

              {unreadCount > 0 && (
                <span className="top-bar__notification-badge">
                  {badgeLabel}
                </span>
              )}
            </button>

          </>
        ) : (
          <div className="top-bar__guest-actions">
            <Link to="/user/login" className="top-bar__auth-link">
              Login
            </Link>
            <Link to="/register" className="top-bar__auth-link top-bar__auth-link--primary">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
