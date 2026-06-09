import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ClipCard from "./ClipCard";
import { useOverlayVisibility } from "../../app/context/useOverlayVisibility";

const ClipFeed = ({
  items = [],

  hasMore,

  loadMore,

  resetKey,

  emptyMessage = "No clips available.",
}) => {
  const viewportRef = useRef(null);
  const scrollerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const currentIndexRef = useRef(0);
  const loadingMoreRef = useRef(false);
  const latestTrimmedCountRef = useRef(0);
  const previousTrimmedCountRef = useRef(0);
  const wheelLockRef = useRef(false);
  const snapTimeoutRef = useRef(null);
  const [height, setHeight] = useState(720);
  const { revealControls } = useOverlayVisibility();

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return undefined;
    }

    const updateHeight = () => {
      setHeight(viewport.getBoundingClientRect().height || 720);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(viewport);

    return () => observer.disconnect();
  }, []);

  const visibleItems = useMemo(() => items.slice(-50), [items]);
  const trimmedCount = items.length - visibleItems.length;
  latestTrimmedCountRef.current = trimmedCount;

  const requestLoadMore = useCallback(() => {
    if (!hasMore || loadingMoreRef.current) {
      return;
    }

    loadingMoreRef.current = true;

    Promise.resolve(loadMore?.()).finally(() => {
      loadingMoreRef.current = false;
    });
  }, [hasMore, loadMore]);

  const scrollToIndex = useCallback(
    (nextIndex, behavior = "smooth") => {
      if (!scrollerRef.current || visibleItems.length === 0) {
        return;
      }

      const maxIndex = Math.max(0, visibleItems.length - 1);
      const clampedIndex = Math.min(Math.max(nextIndex, 0), maxIndex);

      currentIndexRef.current = clampedIndex;
      scrollerRef.current.scrollTo({
        top: clampedIndex * height,
        behavior,
      });

      if (nextIndex > maxIndex) {
        requestLoadMore();
      }
    },
    [height, requestLoadMore, visibleItems.length],
  );

  const snapToNearest = useCallback(() => {
    if (!scrollerRef.current || height <= 0) {
      return;
    }

    const nearestIndex = Math.round(scrollerRef.current.scrollTop / height);
    scrollToIndex(nearestIndex);
  }, [height, scrollToIndex]);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return undefined;
    }

    const handleWheel = (event) => {
      if (Math.abs(event.deltaY) < 8) {
        return;
      }

      event.preventDefault();

      if (wheelLockRef.current) {
        return;
      }

      revealControls();

      const direction = event.deltaY > 0 ? 1 : -1;
      wheelLockRef.current = true;
      scrollToIndex(currentIndexRef.current + direction);

      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 360);
    };

    scroller.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      scroller.removeEventListener("wheel", handleWheel);
    };
  }, [revealControls, scrollToIndex]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const sentinel = loadMoreRef.current;

    if (!scroller || !sentinel || !hasMore) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          requestLoadMore();
        }
      },
      {
        root: scroller,
        rootMargin: "100% 0px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, requestLoadMore, visibleItems.length]);

  useEffect(() => {
    scrollToIndex(currentIndexRef.current, "auto");
  }, [height, scrollToIndex]);

  useEffect(() => {
    currentIndexRef.current = 0;
    previousTrimmedCountRef.current = latestTrimmedCountRef.current;
    scrollerRef.current?.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [resetKey]);

  useEffect(() => {
    const trimDelta = trimmedCount - previousTrimmedCountRef.current;
    previousTrimmedCountRef.current = trimmedCount;

    if (trimDelta <= 0) {
      return;
    }

    currentIndexRef.current = Math.max(0, currentIndexRef.current - trimDelta);
    scrollToIndex(currentIndexRef.current, "auto");
  }, [scrollToIndex, trimmedCount]);

  useEffect(() => {
    return () => {
      window.clearTimeout(snapTimeoutRef.current);
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollerRef.current || height <= 0) {
      return;
    }

    revealControls();
    currentIndexRef.current = Math.round(scrollerRef.current.scrollTop / height);

    window.clearTimeout(snapTimeoutRef.current);
    snapTimeoutRef.current = window.setTimeout(snapToNearest, 120);
  }, [height, revealControls, snapToNearest]);

  return (
    <div className="clip-feed-viewport" ref={viewportRef}>
      <div
        className="clip-feed-scroller"
        ref={scrollerRef}
        onScroll={handleScroll}
      >
        {visibleItems.length > 0 ? (
          visibleItems.map((clip) => (
            <section className="clip-feed-item" key={clip._id}>
              <ClipCard clip={clip} />
            </section>
          ))
        ) : (
          <div className="empty-state">{emptyMessage}</div>
        )}

        <div ref={loadMoreRef} className="clip-feed-sentinel" aria-hidden="true" />
      </div>
    </div>
  );
};

export default ClipFeed;
