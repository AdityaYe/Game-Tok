import React from "react";

import { FaHeart, FaBookmark, FaComment } from "react-icons/fa";

import { useLikeClip } from "../../features/clips/hooks/useLikeClip";

import { useSaveClip } from "../../features/clips/hooks/useSaveClip";

const ClipActions = ({ clip, onOpenComments }) => {
  const likeMutation = useLikeClip();

  const saveMutation = useSaveClip();

  return (
    <div
      className="
      clip-actions
    "
    >
      <button onClick={() => likeMutation.mutate(clip._id)}>
        <FaHeart />

        <span>{clip.likeCount || 0}</span>
      </button>

      <button onClick={() => onOpenComments()}>
        <FaComment />

        <span>{clip.commentCount || 0}</span>
      </button>

      <button onClick={() => saveMutation.mutate(clip._id)}>
        <FaBookmark />

        <span>{clip.savesCount || 0}</span>
      </button>
    </div>
  );
};

export default ClipActions;
