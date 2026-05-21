import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import useAuthStore from "../../store/authStore";

const TopBar = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <header className="top-bar">
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
              className="top-bar__icon-btn"
              aria-label="Notifications"
              onClick={() => navigate("/notifications")}
            >
              <FaBell />
            </button>

            <button
              type="button"
              className="top-bar__avatar-btn"
              aria-label="Profile"
              onClick={() => navigate("/profile")}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.fullName || "Profile"} />
              ) : (
                <FaUserCircle />
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
