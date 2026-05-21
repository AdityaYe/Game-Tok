import React, { useEffect, useRef, useState } from "react";

import { FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

import { useVideoVisibility } from "../../features/video/hooks/useVideoVisibility";

import { useWatchTracker } from "../../features/video/hooks/useWatchTracker";

const VideoPlayer = ({ clipId, video, thumbnail }) => {
  const videoRef = useRef(null);

  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);

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
      if (!paused) {
        videoElement.play().catch(() => {});
      }
    } else {
      videoElement.pause();
    }
  }, [isVisible, paused]);

  const togglePlayback = () => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    if (videoElement.paused) {
      setPaused(false);
      videoElement.play().catch(() => {});
      return;
    }

    setPaused(true);
    videoElement.pause();
  };

  const toggleMute = (event) => {
    event.stopPropagation();
    setMuted((value) => !value);
  };

  return (
    <div className="video-wrapper" onClick={togglePlayback}>
      <div className="video-frame">
        <video
          ref={videoRef}
          src={video}
          aria-label="Gameplay clip player"
          poster={thumbnail}
          preload="auto"
          muted={muted}
          loop
          playsInline
          className="clip-video"
        />
        </div>
        <div className={`video-center-controls ${paused ? "is-visible" : ""}`}>
          {paused && (
            <button
              className="video-control-button video-control-button--play"
              type="button"
              aria-label="Play clip"
              onClick={(event) => {
                event.stopPropagation();
                togglePlayback();
              }}
            >
              <FaPlay />
            </button>
          )}

          <button
            className="video-control-button"
            type="button"
            aria-label={muted ? "Unmute clip" : "Mute clip"}
            onClick={toggleMute}
          >
            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </div>
      </div>
  );
};

export default VideoPlayer;
