import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import VideoPlayer from "./VideoPlayer";
import ClipActions from "./ClipActions";
import CommentModal from "./CommentModal";

const ClipCard = ({ clip }) => {
  const [showComments, setShowComments] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!clip) {
    return null;
  }

  const caption = clip.caption ?? clip.description ?? "";

  const creatorName = clip.creator?.fullName || "GameTok player";

  const creatorInitial = creatorName?.[0] || "G";

  const tags = (clip.tags || []).slice(0, 6);

  const hasExpandableContent =
    caption.length > 90 || tags.length > 0 || clip.gameName;

  const previewCaption = useMemo(() => {
    if (caption.length <= 110) {
      return caption;
    }

    return `${caption.slice(0, 110)}...`;
  }, [caption]);

  return (
    <div className="clip-card">
      <VideoPlayer
        clipId={clip._id}
        video={clip.video}
        thumbnail={clip.thumbnail}
      />

      <div className="clip-overlay" aria-hidden="true">
        <div className="clip-overlay-gradient" />
      </div>

      <div className="clip-ui-layer">
        <div className="clip-overlay-frame">
          <div className="clip-bottom-meta">
            <div className="clip-creator-row">
              <Link
                className="clip-info-avatar"
                to={`/profile/${clip.creator?._id || ""}`}
                aria-label={`Open ${creatorName}'s profile`}
              >
                {clip.creator?.avatar ? (
                  <img src={clip.creator.avatar} alt="" />
                ) : (
                  <span>{creatorInitial}</span>
                )}
              </Link>

              <div className="clip-creator-copy">
                <p className="clip-creator-name">@{creatorName}</p>
              </div>
            </div>

            {caption && (
              <div className="clip-caption-block">
                <p className={`clip-caption ${expanded ? "expanded" : ""}`}>
                  {expanded ? caption : previewCaption}
                </p>

                {hasExpandableContent && (
                  <button
                    type="button"
                    className="clip-expand-btn"
                    onClick={() => setExpanded((value) => !value)}
                  >
                    {expanded ? "Show less" : "Load more"}
                  </button>
                )}
              </div>
            )}

            <div className={`clip-expanded-meta ${expanded ? "expanded" : ""}`}>
              {clip.gameName && (
                <h3 className="clip-game-name">{clip.gameName}</h3>
              )}

              {tags.length > 0 && (
                <div className="clip-tags">
                  {tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <ClipActions clip={clip} onOpenComments={() => setShowComments(true)} />
      </div>

      {showComments && (
        <CommentModal
          clipId={clip._id}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
};

export default ClipCard;
