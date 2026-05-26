import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

import VideoPlayer from "./VideoPlayer";
import ClipActions from "./ClipActions";
import CommentModal from "./CommentModal";
import { useLikeClip } from "../../features/clips/hooks/useLikeClip";
import { useFollowUser } from "../../features/users/hooks/useFollowUser";
import useAuthStore from "../../store/authStore";

const ClipCard = ({ clip }) => {
  const [showComments, setShowComments] = useState(false);

  const [expanded, setExpanded] = useState(false);

  const [controlsVisible, setControlsVisible] = useState(true);

  const [isLongVideo, setIsLongVideo] = useState(false);

  const [heartBurstKey, setHeartBurstKey] = useState(null);
  const [isFollowingCreator, setIsFollowingCreator] = useState(false);

  const controlsTimerRef = useRef(null);
  const doubleTapLikedRef = useRef(false);
  const latestClipRef = useRef(clip);
  const doubleTapPendingRef = useRef(false);
  const likeFromDoubleTapRef = useRef(null);
  const {
    mutate: likeFromDoubleTap,
    isPending: isDoubleTapLikePending,
  } = useLikeClip();
  const followMutation = useFollowUser();
  const currentUser = useAuthStore((state) => state.user);

  const caption = clip?.caption ?? clip?.description ?? "";

  const creatorName = clip?.creator?.fullName || "GameTok player";
  const creatorId = clip?.creator?._id;
  const isOwnClip = currentUser?._id && creatorId === currentUser._id;

  const creatorInitial = creatorName?.[0] || "G";

  const tags = (clip?.tags || []).slice(0, 6);

  const hasExpandableContent =
    caption.length > 90 || tags.length > 0 || clip?.gameName;

  const previewCaption = useMemo(() => {
    if (caption.length <= 110) {
      return caption;
    }

    return `${caption.slice(0, 110)}...`;
  }, [caption]);

  const revealControls = useCallback(() => {
    setControlsVisible(true);

    window.clearTimeout(controlsTimerRef.current);

    controlsTimerRef.current = window.setTimeout(() => {
      setControlsVisible(false);
    }, 2500);
  }, []);

  useEffect(() => {
    revealControls();

    return () => {
      window.clearTimeout(controlsTimerRef.current);
    };
  }, [revealControls]);

  useEffect(() => {
    doubleTapLikedRef.current = false;
    setHeartBurstKey(null);
  }, [clip?._id]);

  useEffect(() => {
    const followingIds = currentUser?.following || [];
    const following = followingIds.some((id) => String(id) === String(creatorId));

    setIsFollowingCreator(following);
  }, [creatorId, currentUser?.following]);

  useEffect(() => {
    latestClipRef.current = clip;
    doubleTapPendingRef.current = isDoubleTapLikePending;
    likeFromDoubleTapRef.current = likeFromDoubleTap;
  }, [clip, isDoubleTapLikePending, likeFromDoubleTap]);

  const handleDoubleTapLike = useCallback(() => {
    const latestClip = latestClipRef.current;

    revealControls();
    setHeartBurstKey(Date.now());

    if (
      !latestClip?._id ||
      latestClip?.liked ||
      latestClip?.isLiked ||
      doubleTapPendingRef.current ||
      doubleTapLikedRef.current
    ) {
      return;
    }

    doubleTapLikedRef.current = true;
    likeFromDoubleTapRef.current?.(latestClip._id);
  }, [revealControls]);

  const handleFollowCreator = useCallback(() => {
    if (!creatorId || isOwnClip || followMutation.isPending) {
      return;
    }

    const previousFollowing = isFollowingCreator;
    const nextFollowing = !previousFollowing;

    revealControls();
    setIsFollowingCreator(nextFollowing);

    followMutation.mutate(
      {
        userId: creatorId,
        following: previousFollowing,
      },
      {
        onSuccess: (result) => {
          if (typeof result?.following === "boolean") {
            setIsFollowingCreator(result.following);
          }
        },
        onError: () => {
          setIsFollowingCreator(previousFollowing);
        },
      },
    );
  }, [
    creatorId,
    followMutation,
    isFollowingCreator,
    isOwnClip,
    revealControls,
  ]);

  if (!clip) {
    return null;
  }

  return (
    <div
      className={`clip-card ${controlsVisible ? "is-controls-visible is-active" : "is-idle"} ${
        isLongVideo ? "is-long-video" : ""
      }`}
      onMouseMove={revealControls}
      onPointerDown={revealControls}
      onTouchStart={revealControls}
    >
      <VideoPlayer
        clipId={clip._id}
        video={clip.video}
        thumbnail={clip.thumbnail}
        onDurationChange={(duration) => setIsLongVideo(duration > 30)}
        onDoubleTapLike={handleDoubleTapLike}
        onInteract={revealControls}
      />

      {heartBurstKey && (
        <div key={heartBurstKey} className="clip-heart-burst" aria-hidden="true">
          <FaHeart />
        </div>
      )}

      <div className="clip-overlay" aria-hidden="true">
        <div className="clip-overlay-gradient" />
      </div>

      <div className="clip-ui-layer">
        <div className="clip-overlay-frame">
          <div className="clip-bottom-meta">
            {/* =========================
                CREATOR
            ========================= */}

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
                <div className="clip-creator-name-row">
                  <p className="clip-creator-name">{creatorName}</p>

                  {!isOwnClip && creatorId && (
                    <button
                      type="button"
                      className={`clip-inline-follow ${
                        isFollowingCreator ? "is-following" : ""
                      }`}
                      disabled={followMutation.isPending}
                      onClick={handleFollowCreator}
                    >
                      {isFollowingCreator ? "Following" : "Follow"}
                    </button>
                  )}
                </div>

                {!expanded && clip.gameName && (
                  <div className="clip-inline-game">
                    <span className="clip-inline-game-name">
                      {clip.gameName}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* =========================
                CAPTION
            ========================= */}

            {caption && (
              <div className="clip-caption-block">
                <p className={`clip-caption ${expanded ? "expanded" : ""}`}>
                  {expanded ? caption : previewCaption}
                </p>
              </div>
            )}

            {/* =========================
                EXPANDED META
            ========================= */}

            {expanded && (
              <>
                {(clip.gameName || clip.gameCover) && (
                  <div className="clip-game-card">
                    {clip.gameCover && (
                      <img
                        src={clip.gameCover}
                        alt={clip.gameName}
                        className="clip-game-cover"
                      />
                    )}

                    <div className="clip-game-copy">
                      <span className="clip-game-label">Game</span>

                      <span className="clip-game-title">{clip.gameName}</span>
                    </div>
                  </div>
                )}

                {tags.length > 0 && (
                  <div className="clip-tags">
                    {tags.map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* =========================
                EXPAND BUTTON
            ========================= */}

            {hasExpandableContent && (
              <button
                type="button"
                className="clip-expand-btn"
                onClick={() => {
                  revealControls();
                  setExpanded((value) => !value);
                }}
              >
                {expanded ? "Show less" : "Load more"}
              </button>
            )}
          </div>
        </div>

        <ClipActions
          clip={clip}
          controlsVisible={controlsVisible}
          isLongVideo={isLongVideo}
          onInteract={revealControls}
          onOpenComments={() => {
            revealControls();
            setShowComments(true);
          }}
        />
      </div>

      {showComments && (
        <CommentModal
          clipId={clip._id}
          clipCreatorId={clip.creator?._id}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
};

export default ClipCard;
