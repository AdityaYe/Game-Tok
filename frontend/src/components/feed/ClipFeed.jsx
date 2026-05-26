import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FixedSizeList } from "react-window";

import { InfiniteLoader } from "react-window-infinite-loader";

import ClipCard from "./ClipCard";

const FeedRow = ({ data, index, style }) => {
  if (!data.isItemLoaded(index)) {
    return <div style={style}>Loading more clips...</div>;
  }

  const clip = data.items[index];

  if (!clip) {
    return null;
  }

  return (
    <div style={style}>
      <ClipCard clip={clip} />
    </div>
  );
};

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

  const isItemLoaded = useCallback((index) => index < items.length, [items.length]);
  const itemData = useMemo(
    () => ({
      isItemLoaded,
      items,
    }),
    [isItemLoaded, items],
  );

  const getItemKey = useCallback(
    (index, data) => data.items[index]?._id || `loader-${index}`,
    [],
  );

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

    scroller.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      scroller.removeEventListener("wheel", handleWheel);
    };
  }, [scrollToIndex]);

  useEffect(() => {
    scrollToIndex(currentIndexRef.current, "auto");
  }, [height, scrollToIndex]);

  useEffect(() => {
    return () => {
      window.clearTimeout(snapTimeoutRef.current);
    };
  }, []);

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
            itemData={itemData}
            itemKey={getItemKey}
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
            {FeedRow}
          </FixedSizeList>
          );
        }}
      </InfiniteLoader>
    </div>
  );
};

export default ClipFeed;
