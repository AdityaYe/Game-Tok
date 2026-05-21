import React from "react";
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
  const { data, isLoading } = useCreatorProfile(id);
  const profile = data?.creator;
  const clips = data?.clips || [];
  const socials = getSocialEntries(profile?.socials);
  const banner = optimizeImage(profile?.banner, 1400);

  if (isLoading) {
    return <main className="creator-profile-page">Loading profile...</main>;
  }

  return (
    <main className="creator-profile-page">
      <section className="profile-identity-hero">
        <div className="profile-cover">
          {banner && <img src={banner} alt="" />}

          <h1 className="profile-cover-name">
            {profile?.fullName || "GameTok Creator"}
          </h1>

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
                <strong>{profile?.followerCount ?? 0}</strong>
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
