import React, { memo, useEffect, useRef, useState } from "react";

import { FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

import { useVideoVisibility } from "../../features/video/hooks/useVideoVisibility";

import { useWatchTracker } from "../../features/video/hooks/useWatchTracker";

const playbackStateCache = new Map();

const VideoPlayer = ({
  clipId,
  video,
  thumbnail,
  onDurationChange,
  onDoubleTapLike,
  onInteract,
}) => {
  const videoRef = useRef(null);
  const tapTimerRef = useRef(null);
  const lastTapRef = useRef(0);
  const pointerStartRef = useRef(null);
  const callbacksRef = useRef({
    onDurationChange,
    onDoubleTapLike,
    onInteract,
  });
  const cachedPlaybackState = playbackStateCache.get(clipId);

  const [muted, setMuted] = useState(cachedPlaybackState?.muted ?? true);
  const [paused, setPaused] = useState(cachedPlaybackState?.paused ?? false);

  const isVisible = useVideoVisibility(videoRef);

  useWatchTracker({
    clipId,
    isVisible,
  });

  useEffect(() => {
    callbacksRef.current = {
      onDurationChange,
      onDoubleTapLike,
      onInteract,
    };
  }, [onDurationChange, onDoubleTapLike, onInteract]);

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

  useEffect(() => {
    const videoElement = videoRef.current;

    return () => {
      if (videoElement) {
        playbackStateCache.set(clipId, {
          currentTime: videoElement.currentTime,
          muted: videoElement.muted,
          paused: videoElement.paused,
        });
      }

      window.clearTimeout(tapTimerRef.current);
    };
  }, [clipId]);

  const togglePlayback = () => {
    callbacksRef.current.onInteract?.();

    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    if (videoElement.paused) {
      setPaused(false);
      playbackStateCache.set(clipId, {
        currentTime: videoElement.currentTime,
        muted,
        paused: false,
      });
      videoElement.play().catch(() => {});
      return;
    }

    setPaused(true);
    playbackStateCache.set(clipId, {
      currentTime: videoElement.currentTime,
      muted,
      paused: true,
    });
    videoElement.pause();
  };

  const toggleMute = (event) => {
    event.stopPropagation();
    callbacksRef.current.onInteract?.();
    setMuted((value) => {
      const nextMuted = !value;
      const videoElement = videoRef.current;

      playbackStateCache.set(clipId, {
        currentTime: videoElement?.currentTime || 0,
        muted: nextMuted,
        paused: videoElement?.paused ?? paused,
      });

      return nextMuted;
    });
  };

  const handleLoadedMetadata = () => {
    const videoElement = videoRef.current;
    const duration = videoElement?.duration || 0;
    const cachedState = playbackStateCache.get(clipId);

    if (
      videoElement &&
      cachedState?.currentTime > 0 &&
      Number.isFinite(videoElement.duration)
    ) {
      videoElement.currentTime = Math.min(
        cachedState.currentTime,
        Math.max(videoElement.duration - 0.25, 0),
      );
    }

    callbacksRef.current.onDurationChange?.(duration);
  };

  const handlePointerDown = (event) => {
    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const handleVideoClick = (event) => {
    if (event.target.closest("button, a, input, textarea, select")) {
      return;
    }

    const pointerStart = pointerStartRef.current;

    if (pointerStart) {
      const deltaX = Math.abs(event.clientX - pointerStart.x);
      const deltaY = Math.abs(event.clientY - pointerStart.y);

      if (deltaX > 12 || deltaY > 12) {
        return;
      }
    }

    callbacksRef.current.onInteract?.();

    const now = Date.now();
    const isDoubleTap = now - lastTapRef.current < 280;

    if (isDoubleTap) {
      window.clearTimeout(tapTimerRef.current);
      lastTapRef.current = 0;
      callbacksRef.current.onDoubleTapLike?.();
      return;
    }

    lastTapRef.current = now;
    window.clearTimeout(tapTimerRef.current);
    tapTimerRef.current = window.setTimeout(() => {
      togglePlayback();
    }, 220);
  };

  return (
    <div
      className="video-wrapper"
      onClick={handleVideoClick}
      onMouseMove={() => callbacksRef.current.onInteract?.()}
      onPointerDown={handlePointerDown}
      onTouchStart={() => callbacksRef.current.onInteract?.()}
    >
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
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>

      <div className={`video-center-controls ${paused ? "is-visible" : ""}`}>
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
      </div>

      <button
        className="video-mute-button"
        type="button"
        aria-label={muted ? "Unmute clip" : "Mute clip"}
        onClick={toggleMute}
      >
        {muted ? <FaVolumeMute /> : <FaVolumeUp />}
      </button>
    </div>
  );
};

export default memo(
  VideoPlayer,
  (previousProps, nextProps) =>
    previousProps.clipId === nextProps.clipId &&
    previousProps.video === nextProps.video &&
    previousProps.thumbnail === nextProps.thumbnail,
);
