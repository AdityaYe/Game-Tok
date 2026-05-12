import React, { useEffect, useRef, useState } from "react";

import { useVideoVisibility } from "../../features/video/hooks/useVideoVisibility";

import { useWatchTracker } from "../../features/video/hooks/useWatchTracker";

const VideoPlayer = ({ clipId, video, thumbnail }) => {
  const videoRef = useRef(null);

  const [muted, setMuted] = useState(true);

  const isVisible = useVideoVisibility(videoRef);

  useWatchTracker({
    clipId,
    isVisible,
  });

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    if (isVisible) {
      videoElement.play().catch(() => {});
    } else {
      videoElement.pause();
    }
  }, [isVisible]);

  return (
    <div
      className="
      video-wrapper
    "
    >
      <video
        ref={videoRef}
        src={video}
        poster={thumbnail}
        muted={muted}
        loop
        playsInline
        className="
          clip-video
        "
      />

      <button
        className="
          mute-button
        "
        onClick={() => setMuted(!muted)}
      >
        {muted ? "Unmute" : "Mute"}
      </button>
    </div>
  );
};

export default VideoPlayer;
