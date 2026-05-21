import React, { useEffect, useMemo, useRef, useState } from "react";

import { FaBookmark, FaCamera, FaHeart } from "react-icons/fa";

import "../../styles/creator-dashboard.css";
import useAuthStore from "../../store/authStore";
import {
  useCreatorDashboard,
  useDeleteDashboardClip,
  useUpdateCreatorAvatar,
  useUpdateCreatorProfile,
  useUpdateDashboardClip,
} from "../../features/creator/hooks/useCreatorDashboard";
import { optimizeImage } from "../../utils/cloudinary";

const Dashboard = () => {
  const avatarInputRef = useRef(null);
  const setUser = useAuthStore((state) => state.setUser);
  const currentUser = useAuthStore((state) => state.user);

  const [clips, setClips] = useState([]);
  const [stats, setStats] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [editGameName, setEditGameName] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editTags, setEditTags] = useState("");
  const [profileDraft, setProfileDraft] = useState({
    fullName: "",
    bio: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [creator, setCreator] = useState(null);

  const { data, isLoading: loading } = useCreatorDashboard();
  const updateAvatar = useUpdateCreatorAvatar();
  const updateProfile = useUpdateCreatorProfile();
  const updateClip = useUpdateDashboardClip();
  const deleteClip = useDeleteDashboardClip();

  useEffect(() => {
    if (data) {
      const nextCreator = data.creator || null;
      setClips(data.clips || []);
      setCreator(nextCreator);
      setStats(data.stats || null);
      setProfileDraft({
        fullName: nextCreator?.fullName || "",
        bio: nextCreator?.bio || "",
      });
    }
  }, [data]);

  const avatarPreviewUrl = useMemo(() => {
    if (!avatar) {
      return "";
    }

    return URL.createObjectURL(avatar);
  }, [avatar]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  const shownAvatar = avatarPreviewUrl || creator?.avatar || "";
  const creatorInitial = creator?.fullName?.[0] || "G";

  function handleAvatarUpload() {
    if (!avatar) {
      avatarInputRef.current?.click();
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatar);

    updateAvatar.mutate(formData, {
      onSuccess: (response) => {
        setCreator((prev) => ({
          ...prev,
          avatar: response.avatar,
        }));
        setUser({
          ...currentUser,
          avatar: response.avatar,
        });
        setAvatar(null);
      },
    });
  }

  function handleProfileSave() {
    updateProfile.mutate(profileDraft, {
      onSuccess: (response) => {
        const nextUser = response.user;
        setCreator((prev) => ({
          ...prev,
          ...nextUser,
        }));
        setUser({
          ...currentUser,
          ...nextUser,
        });
        setIsEditingProfile(false);
      },
    });
  }

  function handleEdit(clip) {
    const formattedTags = editTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    updateClip.mutate(
      {
        clipId: clip._id,
        payload: {
          gameName: editGameName,
          caption: editCaption,
          description: editCaption,
          tags: formattedTags,
        },
      },
      {
        onSuccess: () => {
          setClips((prev) =>
            prev.map((item) =>
              item._id === clip._id
                ? {
                    ...item,
                    gameName: editGameName,
                    caption: editCaption,
                    description: editCaption,
                    tags: formattedTags,
                  }
                : item,
            ),
          );

          setEditingId(null);
        },
      },
    );
  }

  function handleDelete(id) {
    deleteClip.mutate(id, {
      onSuccess: () => {
        setClips((prev) => prev.filter((clip) => clip._id !== id));
        setStats((prev) => ({
          ...prev,
          totalClips: Math.max(0, (prev?.totalClips || 1) - 1),
        }));
      },
    });
  }

  if (loading) {
    return <div className="dashboard-loading">Loading studio...</div>;
  }

  return (
    <div className="creator-dashboard-page">
      <section className="studio-profile-card" aria-labelledby="studio-title">
        <div className="studio-profile-summary">
          <button
            type="button"
            className="studio-avatar-editor"
            onClick={() => avatarInputRef.current?.click()}
            aria-label="Choose profile avatar"
          >
            {shownAvatar ? (
              <img
                src={avatarPreviewUrl || optimizeImage(shownAvatar, 800)}
                alt={creator?.fullName || "Profile"}
              />
            ) : (
              <span>{creatorInitial}</span>
            )}

            <span className="studio-avatar-editor__badge">
              <FaCamera />
            </span>
          </button>

          <input
            ref={avatarInputRef}
            className="studio-avatar-input"
            type="file"
            accept="image/*"
            onChange={(event) => setAvatar(event.target.files?.[0] || null)}
          />

          <div className="studio-profile-copy">
            <p className="studio-eyebrow">Creator Studio</p>
            <h1 id="studio-title">{creator?.fullName || "Studio"}</h1>
            <p>{creator?.bio || "Manage your profile, clips, and performance in one place."}</p>

            {avatar && (
              <div className="studio-avatar-actions">
                <button
                  type="button"
                  className="studio-primary-btn"
                  onClick={handleAvatarUpload}
                  disabled={updateAvatar.isPending}
                >
                  {updateAvatar.isPending ? "Saving..." : "Save avatar"}
                </button>
                <button
                  type="button"
                  className="studio-ghost-btn"
                  onClick={() => setAvatar(null)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="studio-edit-profile-btn"
            onClick={() => setIsEditingProfile((value) => !value)}
          >
            {isEditingProfile ? "Close" : "Edit Profile"}
          </button>
        </div>

        {isEditingProfile && (
          <div className="studio-edit-card">
            <label>
              Display name
              <input
                value={profileDraft.fullName}
                onChange={(event) =>
                  setProfileDraft((prev) => ({
                    ...prev,
                    fullName: event.target.value,
                  }))
                }
                placeholder="Your GameTok name"
              />
            </label>

            <label>
              Bio
              <textarea
                value={profileDraft.bio}
                onChange={(event) =>
                  setProfileDraft((prev) => ({
                    ...prev,
                    bio: event.target.value,
                  }))
                }
                placeholder="Tell people what you play."
                rows={3}
              />
            </label>

            <button
              type="button"
              className="studio-primary-btn"
              onClick={handleProfileSave}
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? "Saving..." : "Save profile"}
            </button>
          </div>
        )}
      </section>

      <section className="dashboard-stats-grid" aria-label="Studio stats">
        <div className="dashboard-stat-card">
          <span className="dashboard-stat-label">Followers</span>
          <h2>{stats?.followerCount ?? creator?.followerCount ?? 0}</h2>
        </div>

        <div className="dashboard-stat-card">
          <span className="dashboard-stat-label">Uploaded Clips</span>
          <h2>{stats?.totalClips || clips.length || 0}</h2>
        </div>
      </section>

      <section className="studio-clips-section" aria-labelledby="studio-clips-title">
        <div className="studio-section-heading">
          <p className="studio-eyebrow">Uploads</p>
          <h2 id="studio-clips-title">Manage clips</h2>
        </div>

        <div className="dashboard-clips-grid">
          {(clips || []).map((clip) => (
            <article key={clip._id} className="dashboard-clip-card">
              <video
                src={clip.video}
                className="dashboard-clip-video"
                muted
                playsInline
                preload="metadata"
              />

              <div className="dashboard-clip-content">
                <h3>{clip.gameName}</h3>

                <p>{clip.caption ?? clip.description}</p>

                {(clip.tags || []).length > 0 && (
                  <div className="dashboard-tags">
                    {(clip.tags || []).map((tag) => (
                      <span key={tag} className="dashboard-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="dashboard-clip-stats">
                  <span>
                    <FaHeart /> {clip.likeCount || 0}
                  </span>

                  <span>
                    <FaBookmark /> {clip.savesCount || 0}
                  </span>
                </div>

                {editingId === clip._id && (
                  <div className="dashboard-edit-form">
                    <input
                      type="text"
                      value={editGameName}
                      onChange={(event) => setEditGameName(event.target.value)}
                      placeholder="Game name"
                    />

                    <textarea
                      value={editCaption}
                      onChange={(event) => setEditCaption(event.target.value)}
                      placeholder="Caption"
                    />

                    <input
                      type="text"
                      value={editTags}
                      onChange={(event) => setEditTags(event.target.value)}
                      placeholder="fps, ranked, funny"
                    />

                    <button
                      className="dashboard-save-btn"
                      type="button"
                      onClick={() => handleEdit(clip)}
                    >
                      Save changes
                    </button>
                  </div>
                )}

                {editingId !== clip._id && (
                  <button
                    className="dashboard-edit-btn"
                    type="button"
                    onClick={() => {
                      setEditingId(clip._id);
                      setEditGameName(clip.gameName || "");
                      setEditCaption(clip.caption ?? clip.description ?? "");
                      setEditTags((clip.tags || []).join(", "));
                    }}
                  >
                    Edit clip
                  </button>
                )}

                <button
                  className="dashboard-delete-btn"
                  type="button"
                  onClick={() => handleDelete(clip._id)}
                >
                  Delete clip
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
