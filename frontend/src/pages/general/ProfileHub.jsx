import { createElement, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaBookmark,
  FaChartLine,
  FaEdit,
  FaInstagram,
  FaPlay,
  FaSignOutAlt,
  FaTwitch,
  FaUpload,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import ProfileLayout from "../../app/layouts/ProfileLayout";
import useAuthStore from "../../store/authStore";
import { updateAuthProfile } from "../../features/auth/api/authApi";
import { useLogout } from "../../features/auth/hooks/useAuthMutations";
import { useCreatorDashboard } from "../../features/creator/hooks/useCreatorDashboard";
import { optimizeImage } from "../../utils/cloudinary";

const socialConfig = {
  youtube: { label: "YouTube", icon: FaYoutube },
  twitch: { label: "Twitch", icon: FaTwitch },
  twitter: { label: "X", icon: FaTwitter },
  instagram: { label: "Instagram", icon: FaInstagram },
};

function getSocialEntries(socials = {}) {
  return Object.entries(socialConfig)
    .map(([key, config]) => ({
      key,
      ...config,
      href: socials?.[key],
    }))
    .filter((item) => item.href);
}

function buildProfileFormData(draft, avatarFile, bannerFile) {
  const formData = new FormData();

  formData.append("fullName", draft.fullName);
  formData.append("bio", draft.bio);
  formData.append("socials", JSON.stringify(draft.socials));

  if (avatarFile) {
    formData.append("avatar", avatarFile);
  }

  if (bannerFile) {
    formData.append("banner", bannerFile);
  }

  return formData;
}

const ProfileAction = ({
  as = Link,
  icon,
  title,
  description,
  className = "",
  ...props
}) => {
  const IconComponent = icon;
  const content = (
    <>
      <span className="profile-action__icon" aria-hidden="true">
        <IconComponent />
      </span>
      <span className="profile-action__copy">
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
    </>
  );

  if (as === "button") {
    return (
      <button className={`profile-action ${className}`} {...props}>
        {content}
      </button>
    );
  }

  return (
    <Link className={`profile-action ${className}`} {...props}>
      {content}
    </Link>
  );
};

const ProfileHub = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logoutMutation = useLogout();
  const { data: dashboardData, isLoading: clipsLoading } = useCreatorDashboard({
    enabled: !!user,
  });

  const uploadedClips = dashboardData?.clips || [];

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [draft, setDraft] = useState({
    fullName: "",
    bio: "",
    socials: {
      youtube: "",
      twitch: "",
      twitter: "",
      instagram: "",
    },
  });

  useEffect(() => {
    setDraft({
      fullName: user?.fullName || "",
      bio: user?.bio || "",
      socials: {
        youtube: user?.socials?.youtube || "",
        twitch: user?.socials?.twitch || "",
        twitter: user?.socials?.twitter || "",
        instagram: user?.socials?.instagram || "",
      },
    });
  }, [user]);

  const avatarPreviewUrl = useMemo(
    () => (avatarFile ? URL.createObjectURL(avatarFile) : ""),
    [avatarFile],
  );
  const bannerPreviewUrl = useMemo(
    () => (bannerFile ? URL.createObjectURL(bannerFile) : ""),
    [bannerFile],
  );

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }

      if (bannerPreviewUrl) {
        URL.revokeObjectURL(bannerPreviewUrl);
      }
    };
  }, [avatarPreviewUrl, bannerPreviewUrl]);

  const updateProfileMutation = useMutation({
    mutationFn: (payload) => updateAuthProfile(payload),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ["creator-dashboard"] });
      setAvatarFile(null);
      setBannerFile(null);
      setIsEditingProfile(false);
    },
  });

  const shownAvatar = avatarPreviewUrl || user?.avatar || "";
  const shownBanner = bannerPreviewUrl || optimizeImage(user?.banner, 1400);
  const socialEntries = getSocialEntries(user?.socials);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        navigate("/", { replace: true });
      },
    });
  };

  const handleProfileSave = () => {
    updateProfileMutation.mutate(
      buildProfileFormData(draft, avatarFile, bannerFile),
    );
  };

  return (
    <ProfileLayout>
      <section className="profile-hub" aria-labelledby="profile-hub-title">
        <section className="profile-identity-hero">
          <div className="profile-cover">
            {shownBanner && <img src={shownBanner} alt="" />}

            <div className="profile-cover-title">
              <h1 id="profile-hub-title" className="profile-cover-name">
                {user?.fullName || "GameTok Player"}
              </h1>
            </div>

            {socialEntries.length > 0 && (
              <div className="profile-socials" aria-label="Social links">
                {socialEntries.map(({ key, label, icon: Icon, href }) => (
                  <a
                    key={key}
                    className="profile-social-pill"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                  >
                    {createElement(Icon)}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="profile-identity-panel">
            <button
              type="button"
              className="profile-hub__avatar profile-hub__avatar--editable"
              onClick={() => {
                setIsEditingProfile(true);
                avatarInputRef.current?.click();
              }}
              aria-label="Choose profile avatar"
            >
              {shownAvatar ? (
                <img
                  src={avatarPreviewUrl || optimizeImage(shownAvatar, 600)}
                  alt={user?.fullName || "Profile"}
                />
              ) : (
                <span>{user?.fullName?.[0] || "G"}</span>
              )}
            </button>

            <div className="profile-identity-copy">
              <div className="profile-stats-strip" aria-label="Profile stats">
                <div>
                  <strong>{user?.followerCount ?? user?.followers?.length ?? 0}</strong>
                  <span>Followers</span>
                </div>
                <div>
                  <strong>{user?.followingCount ?? user?.following?.length ?? 0}</strong>
                  <span>Following</span>
                </div>
                <div>
                  <strong>{uploadedClips.length}</strong>
                  <span>Uploads</span>
                </div>
              </div>
            </div>
          </div>

          {user?.bio && <p className="profile-hub__bio">{user.bio}</p>}
        </section>

        {isEditingProfile && (
          <section className="profile-edit-panel" aria-label="Edit profile">
            <input
              ref={avatarInputRef}
              className="profile-file-input"
              type="file"
              accept="image/*"
              onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
            />
            <input
              ref={bannerInputRef}
              className="profile-file-input"
              type="file"
              accept="image/*"
              onChange={(event) => setBannerFile(event.target.files?.[0] || null)}
            />

            <div className="profile-edit-panel__media">
              <button type="button" onClick={() => avatarInputRef.current?.click()}>
                {avatarFile ? "Avatar selected" : "Upload avatar"}
              </button>
              <button type="button" onClick={() => bannerInputRef.current?.click()}>
                {bannerFile ? "Banner selected" : "Upload banner"}
              </button>
            </div>

            <label>
              Display name
              <input
                value={draft.fullName}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    fullName: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              Bio
              <textarea
                value={draft.bio}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    bio: event.target.value,
                  }))
                }
                rows={3}
              />
            </label>

            <div className="profile-social-edit-grid">
              {Object.entries(socialConfig).map(([key, { label, icon: Icon }]) => (
                <label key={key}>
                  <span>
                    {createElement(Icon)}
                    {label}
                  </span>
                  <input
                    value={draft.socials[key]}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        socials: {
                          ...prev.socials,
                          [key]: event.target.value,
                        },
                      }))
                    }
                  />
                </label>
              ))}
            </div>

            <button
              type="button"
              className="profile-save-btn"
              onClick={handleProfileSave}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save profile"}
            </button>
          </section>
        )}

        <section className="profile-section" aria-labelledby="profile-actions-title">
          <div className="profile-action-grid profile-action-grid--compact">
            <ProfileAction
              as="button"
              type="button"
              icon={FaEdit}
              title={isEditingProfile ? "Close editor" : "Edit profile"}
              description="Update avatar, banner, and bio"
              onClick={() => setIsEditingProfile((value) => !value)}
            />

            <ProfileAction
              to="/upload-clip"
              icon={FaUpload}
              title="Upload clip"
              description="Post a gameplay moment"
              className="profile-action--accent"
            />

            <ProfileAction
              to="/saved"
              icon={FaBookmark}
              title="Saved"
              description="Replay favorites"
            />

            {uploadedClips.length > 0 && (
              <ProfileAction
                to="/dashboard"
                icon={FaChartLine}
                title="Studio"
                description="Manage uploads"
              />
            )}
          </div>
        </section>

        <section className="profile-section" aria-labelledby="uploaded-clips-title">
          <div className="profile-section__header profile-section__header--row">
            <div>
              <h2 id="uploaded-clips-title">Uploaded clips</h2>
            </div>
          </div>

          {clipsLoading ? (
            <p className="profile-empty">Loading uploaded clips...</p>
          ) : uploadedClips.length > 0 ? (
            <div className="profile-upload-grid">
              {uploadedClips.map((clip) => (
                <button
                  key={clip._id}
                  type="button"
                  className="profile-upload-card"
                  onClick={() =>
                    navigate(`/profile/clips/${clip._id}`, {
                      state: { clips: uploadedClips },
                    })
                  }
                >
                  <video
                    src={clip.video}
                    poster={clip.thumbnail}
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <span className="profile-upload-card__play" aria-hidden="true">
                    <FaPlay />
                  </span>
                  <div>
                    <strong>{clip.gameName || "Gameplay clip"}</strong>
                    <span>{clip.likeCount || 0} likes</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="profile-empty">No uploads yet.</p>
          )}
        </section>

        <section className="profile-section" aria-labelledby="account-title">
          <div className="profile-action-grid">
            <ProfileAction
              as="button"
              type="button"
              icon={FaSignOutAlt}
              title={logoutMutation.isPending ? "Logging out..." : "Logout"}
              description="End this session"
              className="profile-action--danger"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            />
          </div>
        </section>
      </section>
    </ProfileLayout>
  );
};

export default ProfileHub;
