import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaInstagram,
  FaPlay,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

import "../../styles/profile.css";
import { useCreatorProfile } from "../../features/creator/hooks/useCreatorProfile";
import { useFollowUser } from "../../features/users/hooks/useFollowUser";
import useAuthStore from "../../store/authStore";
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

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = useAuthStore((state) => state.user);
  const { data, isLoading } = useCreatorProfile(id);
  const followMutation = useFollowUser();
  const profile = data?.creator;
  const clips = data?.clips || [];
  const socials = getSocialEntries(profile?.socials);
  const banner = optimizeImage(profile?.banner, 1400);
  const isOwnProfile = currentUser?._id && currentUser._id === profile?._id;
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    setIsFollowing(!!data?.isFollowing);
    setFollowerCount(profile?.followerCount ?? 0);
  }, [data?.isFollowing, profile?.followerCount]);

  const handleFollow = () => {
    if (!profile?._id || followMutation.isPending) {
      return;
    }

    const nextFollowing = !isFollowing;

    setIsFollowing(nextFollowing);
    setFollowerCount((count) =>
      Math.max(0, count + (nextFollowing ? 1 : -1)),
    );

    followMutation.mutate(
      {
        userId: profile._id,
        following: isFollowing,
      },
      {
        onSuccess: (result) => {
          setIsFollowing(result.following);
          setFollowerCount(result.followerCount ?? 0);
        },
        onError: () => {
          setIsFollowing(isFollowing);
          setFollowerCount((count) =>
            Math.max(0, count + (nextFollowing ? -1 : 1)),
          );
        },
      },
    );
  };

  if (isLoading) {
    return <main className="creator-profile-page">Loading profile...</main>;
  }

  return (
    <main className="creator-profile-page">
      <section className="profile-identity-hero">
        <div className="profile-cover">
          {banner && <img src={banner} alt="" />}

          <div className="profile-cover-title">
            <h1 className="profile-cover-name">
              {profile?.fullName || "GameTok Creator"}
            </h1>

          {profile && currentUser && !isOwnProfile && (
              <button
                type="button"
                className={`profile-follow-btn ${isFollowing ? "is-following" : ""}`}
                onClick={handleFollow}
                disabled={followMutation.isPending}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>

          {socials.length > 0 && (
            <div className="profile-socials" aria-label="Social links">
              {socials.map(({ key, label, icon: Icon, href }) => (
                <a
                  key={key}
                  className="profile-social-pill"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                >
                  <Icon />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="profile-identity-panel">
          <div className="profile-hub__avatar">
            {profile?.avatar ? (
              <img
                src={optimizeImage(profile.avatar, 600)}
                alt={profile?.fullName || "Profile avatar"}
              />
            ) : (
              <span>{profile?.fullName?.[0] || "G"}</span>
            )}
          </div>

          <div className="profile-identity-copy">
            <div className="profile-stats-strip" aria-label="Profile stats">
              <div>
                <strong>{followerCount}</strong>
                <span>Followers</span>
              </div>
              <div>
                <strong>{profile?.followingCount ?? 0}</strong>
                <span>Following</span>
              </div>
              <div>
                <strong>{clips.length}</strong>
                <span>Uploads</span>
              </div>
            </div>
          </div>
        </div>

        {profile?.bio && <p className="profile-hub__bio">{profile.bio}</p>}
      </section>

      <section className="profile-section" aria-label="Profile clips">
        <div className="profile-section__header">
          <h2>Creator clips</h2>
        </div>

        {clips.length > 0 ? (
          <div className="profile-upload-grid">
            {clips.map((clip) => (
              <button
                key={clip._id}
                type="button"
                className="profile-upload-card"
                onClick={() =>
                  navigate(`/profile/clips/${clip._id}`, {
                    state: { clips },
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
          <p className="profile-empty">No clips uploaded yet.</p>
        )}
      </section>
    </main>
  );
};

export default Profile;
