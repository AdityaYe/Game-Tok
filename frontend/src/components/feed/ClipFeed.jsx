import React, { useCallback, useEffect, useRef, useState } from "react";

import { FixedSizeList } from "react-window";

import { InfiniteLoader } from "react-window-infinite-loader";

import ClipCard from "./ClipCard";

const ClipFeed = ({
  items = [],

  hasMore,

  loadMore,
}) => {
  const viewportRef = useRef(null);
  const outerRef = useRef(null);
  const currentIndexRef = useRef(0);
  const wheelLockRef = useRef(false);
  const snapTimeoutRef = useRef(null);
  const dragRef = useRef({
    active: false,
    startY: 0,
    scrollTop: 0,
  });
  const [height, setHeight] = useState(720);

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

  const itemCount = hasMore ? items.length + 1 : items.length;

  const isItemLoaded = (index) => index < items.length;

  const scrollToIndex = useCallback(
    (nextIndex, behavior = "smooth") => {
      if (!outerRef.current || itemCount === 0) {
        return;
      }

      const maxIndex = Math.max(0, itemCount - 1);
      const clampedIndex = Math.min(Math.max(nextIndex, 0), maxIndex);

      currentIndexRef.current = clampedIndex;
      outerRef.current.scrollTo({
        top: clampedIndex * height,
        behavior,
      });
    },
    [height, itemCount],
  );

  const snapToNearest = useCallback(() => {
    if (!outerRef.current || height <= 0) {
      return;
    }

    const nearestIndex = Math.round(outerRef.current.scrollTop / height);
    scrollToIndex(nearestIndex);
  }, [height, scrollToIndex]);

  useEffect(() => {
    const scroller = outerRef.current;

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

      const direction = event.deltaY > 0 ? 1 : -1;
      wheelLockRef.current = true;
      scrollToIndex(currentIndexRef.current + direction);

      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 360);
    };

    const handlePointerDown = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      if (event.target.closest("button, a, input, textarea, select")) {
        return;
      }

      dragRef.current = {
        active: true,
        startY: event.clientY,
        scrollTop: scroller.scrollTop,
      };
      scroller.classList.add("is-dragging");
      scroller.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = (event) => {
      if (!dragRef.current.active) {
        return;
      }

      event.preventDefault();
      const deltaY = event.clientY - dragRef.current.startY;
      scroller.scrollTop = dragRef.current.scrollTop - deltaY;
    };

    const endDrag = (event) => {
      if (!dragRef.current.active) {
        return;
      }

      dragRef.current.active = false;
      scroller.classList.remove("is-dragging");
      scroller.releasePointerCapture?.(event.pointerId);
      snapToNearest();
    };

    scroller.addEventListener("wheel", handleWheel, { passive: false });
    scroller.addEventListener("pointerdown", handlePointerDown);
    scroller.addEventListener("pointermove", handlePointerMove);
    scroller.addEventListener("pointerup", endDrag);
    scroller.addEventListener("pointercancel", endDrag);

    return () => {
      scroller.removeEventListener("wheel", handleWheel);
      scroller.removeEventListener("pointerdown", handlePointerDown);
      scroller.removeEventListener("pointermove", handlePointerMove);
      scroller.removeEventListener("pointerup", endDrag);
      scroller.removeEventListener("pointercancel", endDrag);
    };
  }, [scrollToIndex, snapToNearest]);

  useEffect(() => {
    scrollToIndex(currentIndexRef.current, "auto");
  }, [height, scrollToIndex]);

  useEffect(() => {
    return () => {
      window.clearTimeout(snapTimeoutRef.current);
    };
  }, []);

  const Row = ({ index, style }) => {
    if (!isItemLoaded(index)) {
      return <div style={style}>Loading more clips...</div>;
    }

    const clip = items[index];

    if (!clip) {
      return null;
    }

    return (
      <div style={style}>
        <ClipCard clip={clip} />
      </div>
    );
  };

  return (
    <div className="clip-feed-viewport" ref={viewportRef}>
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMore}
      >
        {({ onItemsRendered, ref }) => {
          const setListRef = (instance) => {
            if (typeof ref === "function") {
              ref(instance);
            } else if (ref) {
              ref.current = instance;
            }
          };

          return (
          <FixedSizeList
            height={height}
            itemCount={itemCount}
            itemSize={height}
            onItemsRendered={onItemsRendered}
            onScroll={({ scrollOffset }) => {
              currentIndexRef.current = Math.round(scrollOffset / height);

              window.clearTimeout(snapTimeoutRef.current);
              snapTimeoutRef.current = window.setTimeout(snapToNearest, 120);
            }}
            outerRef={outerRef}
            ref={setListRef}
            width="100%"
          >
            {Row}
          </FixedSizeList>
          );
        }}
      </InfiniteLoader>
    </div>
  );
};

export default ClipFeed;
