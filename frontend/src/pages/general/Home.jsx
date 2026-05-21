import React from "react";

import "../../styles/clips.css";

import ClipFeed from "../../components/feed/ClipFeed";

import FeedSkeleton from "../../components/ui/skeletons/FeedSkeleton";

import { useFeed } from "../../features/clips/hooks/useFeed";

const Home = () => {
  const {
    data,

    fetchNextPage,

    hasNextPage,

    isFetchingNextPage,

    isLoading,
  } = useFeed();

  const clips = data?.pages.flatMap((page) => page.clips || []) || [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      return fetchNextPage();
    }

    return Promise.resolve();
  };

  if (isLoading) {
    return (
      <>
        <FeedSkeleton />
        <FeedSkeleton />
        <FeedSkeleton />
      </>
    );
  }

  return (
    <ClipFeed
      items={clips}
      hasMore={hasNextPage}
      loadMore={loadMore}
      emptyMessage="
        No clips available.
      "
    />
  );
};

export default Home;
