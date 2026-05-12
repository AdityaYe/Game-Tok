import React from "react";

import { FixedSizeList as List } from "react-window";

import InfiniteLoader from "react-window-infinite-loader";

import ClipCard from "./ClipCard";

const ITEM_SIZE = 720;

const ClipFeed = ({ items, hasMore, loadMore }) => {
  const itemCount = hasMore ? items.length + 1 : items.length;

  const isItemLoaded = (index) => index < items.length;

  const Row = ({ index, style }) => {
    if (!isItemLoaded(index)) {
      return <div style={style}>Loading...</div>;
    }

    const clip = items[index];

    return (
      <div style={style}>
        <ClipCard clip={clip} />
      </div>
    );
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMore}
    >
      {({ onItemsRendered, ref }) => (
        <List
          height={window.innerHeight}
          itemCount={itemCount}
          itemSize={ITEM_SIZE}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width={"100%"}
        >
          {Row}
        </List>
      )}
    </InfiniteLoader>
  );
};

export default ClipFeed;
