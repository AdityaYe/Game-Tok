import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ClipFeed from "../../components/feed/ClipFeed";
import FeedSkeleton from "../../components/ui/skeletons/FeedSkeleton";
import { useFollowingFeed } from "../../features/clips/hooks/useFollowingFeed";
import { optimizeImage } from "../../utils/cloudinary";

import "../../styles/clips.css";
import "../../styles/following-feed.css";

const FollowingFeed = () => {
  const navigate = useNavigate();
  const screenPointerRef = useRef(null);
  const wheelPointerRef = useRef(null);
  const wheelLockRef = useRef(false);
  const lastTapRef = useRef({
    creatorId: "",
    time: 0,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCreatorId, setSelectedCreatorId] = useState("");
  const [selectorHidden, setSelectorHidden] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useFollowingFeed(selectedCreatorId);

  const creators = useMemo(() => data?.pages[0]?.creators || [], [data?.pages]);
  const realSelectorItems = useMemo(
    () => [
      {
        _id: "",
        fullName: "Following",
        type: "all",
      },
      ...creators.map((creator) => ({
        ...creator,
        type: "creator",
      })),
    ],
    [creators],
  );
  const activeSelectorItem = realSelectorItems[activeIndex] || realSelectorItems[0];
  const selectorSlots = useMemo(() => {
    const usedOffsets = new Set();
    const shouldWrap = realSelectorItems.length >= 7;
    const realSlots = realSelectorItems
      .map((item, index) => {
        let offset = index - activeIndex;

        if (shouldWrap) {
          const half = realSelectorItems.length / 2;

          if (offset > half) {
            offset -= realSelectorItems.length;
          } else if (offset < -half) {
            offset += realSelectorItems.length;
          }
        }

        return {
          item,
          offset,
        };
      })
      .filter(({ offset }) => Math.abs(offset) <= 3);

    realSlots.forEach(({ offset }) => usedOffsets.add(offset));

    const placeholderSlots = [];

    for (let offset = -3; offset <= 3; offset += 1) {
      if (!usedOffsets.has(offset)) {
        placeholderSlots.push({
          item: {
            _id: `placeholder-${offset}`,
            type: "placeholder",
          },
          offset,
        });
      }
    }

    return [...realSlots, ...placeholderSlots].sort((a, b) => a.offset - b.offset);
  }, [activeIndex, realSelectorItems]);
  const clips = useMemo(
    () => data?.pages.flatMap((page) => page.clips || []) || [],
    [data?.pages],
  );

  useEffect(() => {
    if (activeIndex > realSelectorItems.length - 1) {
      setActiveIndex(Math.max(realSelectorItems.length - 1, 0));
    }
  }, [activeIndex, realSelectorItems.length]);

  useEffect(() => {
    setSelectedCreatorId(
      activeSelectorItem?.type === "creator" ? activeSelectorItem._id : "",
    );
  }, [activeSelectorItem]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      return fetchNextPage();
    }

    return Promise.resolve();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const moveWheel = useCallback((direction) => {
    if (wheelLockRef.current || realSelectorItems.length <= 1) {
      return;
    }

    wheelLockRef.current = true;

    setActiveIndex((current) => {
      const nextIndex = current + direction;

      if (nextIndex < 0) {
        return realSelectorItems.length - 1;
      }

      if (nextIndex >= realSelectorItems.length) {
        return 0;
      }

      return nextIndex;
    });

    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, 180);
  }, [realSelectorItems.length]);

  const handleActiveTap = useCallback(() => {
    if (!activeSelectorItem?._id || activeSelectorItem.type !== "creator") {
      return;
    }

    const now = Date.now();
    const isDoubleTap =
      lastTapRef.current.creatorId === activeSelectorItem._id &&
      now - lastTapRef.current.time < 300;

    if (isDoubleTap) {
      lastTapRef.current = {
        creatorId: "",
        time: 0,
      };
      navigate(`/profile/${activeSelectorItem._id}`);
      return;
    }

    lastTapRef.current = {
      creatorId: activeSelectorItem._id,
      time: now,
    };
  }, [activeSelectorItem, navigate]);

  const handleWheel = useCallback(
    (event) => {
      if (Math.abs(event.deltaY) < 10) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      moveWheel(event.deltaY > 0 ? 1 : -1);
    },
    [moveWheel],
  );

  const handleWheelPointerDown = useCallback((event) => {
    wheelPointerRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }, []);

  const handleWheelPointerUp = useCallback(
    (event) => {
      const pointerStart = wheelPointerRef.current;

      if (!pointerStart) {
        return;
      }

      const deltaX = event.clientX - pointerStart.x;
      const deltaY = event.clientY - pointerStart.y;

      wheelPointerRef.current = null;

      if (Math.abs(deltaY) > 22 && Math.abs(deltaY) > Math.abs(deltaX) * 1.15) {
        event.stopPropagation();
        moveWheel(deltaY < 0 ? 1 : -1);
      }
    },
    [moveWheel],
  );

  const handleScreenPointerDown = useCallback((event) => {
    screenPointerRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  }, []);

  const handleScreenPointerUp = useCallback((event) => {
    const pointerStart = screenPointerRef.current;

    if (!pointerStart) {
      return;
    }

    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;

    screenPointerRef.current = null;

    if (deltaX < -44 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      setSelectorHidden(true);
      return;
    }

    if (
      selectorHidden &&
      pointerStart.x < 42 &&
      deltaX > 36 &&
      Math.abs(deltaX) > Math.abs(deltaY) * 1.2
    ) {
      setSelectorHidden(false);
    }
  }, [selectorHidden]);

  if (isLoading) {
    return (
      <div className="following-feed-page">
        <div className="following-feed-shell">
          <FeedSkeleton />
          <FeedSkeleton />
        </div>
        <div className="following-rail following-rail--loading" />
      </div>
    );
  }

  return (
    <div
      className={`following-feed-page ${selectorHidden ? "is-selector-hidden" : ""}`}
      onPointerDown={handleScreenPointerDown}
      onPointerUp={handleScreenPointerUp}
      onPointerCancel={() => {
        screenPointerRef.current = null;
      }}
    >
      <div className="following-feed-shell">
        {creators.length === 0 ? (
          <div className="following-empty">
            <strong>No following feed yet.</strong>
            <span>Follow creators to build a personalized clip stream.</span>
          </div>
        ) : clips.length === 0 ? (
          <div className="following-empty">
            <strong>No clips from this selection.</strong>
            <span>Try All Following or check back after new uploads.</span>
          </div>
        ) : (
          <ClipFeed
            items={clips}
            hasMore={hasNextPage}
            loadMore={loadMore}
            resetKey={selectedCreatorId || "all"}
          />
        )}
      </div>

      <section
        className="following-rail"
        aria-label="Following creators"
        onWheel={handleWheel}
        onPointerDown={handleWheelPointerDown}
        onPointerUp={handleWheelPointerUp}
        onPointerCancel={() => {
          wheelPointerRef.current = null;
        }}
      >
        {selectorSlots.map(({ item, offset }) => {
          const isAll = item.type === "all";
          const isPlaceholder = item.type === "placeholder";
          const isActive = offset === 0 && !isPlaceholder;
          const depth = Math.abs(offset);
          const curveX = [34, 22, 10, -2][depth];
          const slotScale = [1.08, 0.94, 0.82, 0.72][depth];
          const slotOpacity = [1, 0.78, 0.58, 0.38][depth];

          return (
            <button
              key={item._id}
              type="button"
              className={`following-pill ${isActive ? "is-active" : ""} ${
                isPlaceholder ? "is-placeholder" : ""
              }`}
              disabled={!isActive || isPlaceholder || isAll}
              aria-hidden={isPlaceholder ? "true" : undefined}
              data-slot={offset}
              style={{
                "--slot-y": `${offset * 54}px`,
                "--slot-x": `${curveX}px`,
                "--slot-scale": slotScale,
                "--slot-opacity": slotOpacity,
              }}
              onClick={handleActiveTap}
            >
              <span className={isAll ? "following-pill__all" : "following-pill__avatar"}>
                {isPlaceholder ? (
                  ""
                ) : isAll ? (
                  "All"
                ) : item.avatar ? (
                  <img
                    src={optimizeImage(item.avatar, 240)}
                    loading="lazy"
                    alt={item.fullName || "Creator"}
                  />
                ) : (
                  item.fullName?.[0] || "G"
                )}
              </span>
              {!isPlaceholder && (
                <span className="following-pill__name">
                  {item.fullName || "Creator"}
                </span>
              )}
            </button>
          );
        })}
      </section>

      <button
        type="button"
        className="following-selector-peek"
        aria-label="Show following selector"
        onClick={() => setSelectorHidden(false)}
      />
    </div>
  );
};

export default FollowingFeed;
