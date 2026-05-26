import React from "react";

import { FaBookmark, FaComment, FaHeart, FaShare } from "react-icons/fa";

import { useLikeClip } from "../../features/clips/hooks/useLikeClip";

import { useSaveClip } from "../../features/clips/hooks/useSaveClip";

const ClipActions = ({
  clip,
  controlsVisible = false,
  isLongVideo = false,
  onInteract,
  onOpenComments,
}) => {
  const likeMutation = useLikeClip();

  const saveMutation = useSaveClip();

  const handleShare = async () => {
    onInteract?.();

    const shareUrl = `${window.location.origin}/profile/${clip.creator?._id || ""}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: clip.gameName,
          text: clip.caption ?? clip.description ?? "",
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard?.writeText(shareUrl);
    } catch {
      // Share cancellation is a normal user action.
    }
  };

  return (
    <div
      className={`clip-actions ${controlsVisible ? "is-controls-visible is-active" : "is-idle"} ${
        isLongVideo ? "is-long-video" : ""
      }`}
      onMouseMove={() => onInteract?.()}
      onTouchStart={() => onInteract?.()}
    >
      <button
        className="clip-action"
        type="button"
        onClick={() => {
          onInteract?.();
          likeMutation.mutate(clip._id);
        }}
        aria-label="Like clip"
      >
        <FaHeart />

        <span>{clip.likeCount || 0}</span>
      </button>

      <button
        className="clip-action"
        type="button"
        onClick={() => {
          onInteract?.();
          onOpenComments();
        }}
        aria-label="Open comments"
      >
        <FaComment />

        <span>{clip.commentCount || 0}</span>
      </button>

      <button
        className="clip-action"
        type="button"
        onClick={() => {
          onInteract?.();
          saveMutation.mutate(clip._id);
        }}
        aria-label="Save clip"
      >
        <FaBookmark />

        <span>{clip.savesCount || 0}</span>
      </button>

      <button
        className="clip-action"
        type="button"
        onClick={handleShare}
        aria-label="Share clip"
      >
        <FaShare />

        <span>Share</span>
      </button>
    </div>
  );
};

export default ClipActions;
