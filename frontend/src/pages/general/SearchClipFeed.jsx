import React, { useMemo } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

import ClipFeed from "../../components/feed/ClipFeed";
import FeedLayout from "../../app/layouts/FeedLayout";
import FeedSkeleton from "../../components/ui/skeletons/FeedSkeleton";
import { useSearch } from "../../features/search/hooks/useSearch";

import "../../styles/clips.css";

const SearchClipFeed = () => {
  const location = useLocation();
  const { clipId } = useParams();
  const [searchParams] = useSearchParams();
  const query = location.state?.query || searchParams.get("q") || "";
  const stateClips = useMemo(() => location.state?.clips || [], [location.state]);
  const { data, isLoading } = useSearch(query);
  const clips = useMemo(() => {
    const sourceClips = stateClips.length > 0 ? stateClips : data?.clips || [];
    const selectedIndex = sourceClips.findIndex((clip) => clip._id === clipId);

    if (selectedIndex <= 0) {
      return sourceClips;
    }

    return [
      ...sourceClips.slice(selectedIndex),
      ...sourceClips.slice(0, selectedIndex),
    ];
  }, [clipId, data?.clips, stateClips]);

  if (isLoading && clips.length === 0) {
    return (
      <>
        <FeedSkeleton />
        <FeedSkeleton />
      </>
    );
  }

  return (
    <FeedLayout>
      <ClipFeed items={clips} hasMore={false} loadMore={() => Promise.resolve()} />
    </FeedLayout>
  );
};

export default SearchClipFeed;
