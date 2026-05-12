import React, { useState } from "react";

import VideoPlayer from "./VideoPlayer";
import ClipActions from "./ClipActions";
import CommentModal from "./CommentModal";

const ClipCard = ({ clip }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div
      className="
      clip-card
    "
    >
      <VideoPlayer clipId={clip._id} video={clip.video} thumbnail={clip.thumbnail} />

      <div
        className="
        clip-info
      "
      >
        <h3>{clip.gameName}</h3>

        <p>{clip.description}</p>
      </div>

      <ClipActions clip={clip} onOpenComments={() => setShowComments(true)} />

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
