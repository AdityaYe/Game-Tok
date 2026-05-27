import React, { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

import ClipFeed from "../../components/feed/ClipFeed";
import FeedLayout from "../../app/layouts/FeedLayout";
import FeedSkeleton from "../../components/ui/skeletons/FeedSkeleton";
import { useCreatorDashboard } from "../../features/creator/hooks/useCreatorDashboard";

import "../../styles/clips.css";

const ProfileClipFeed = () => {
  const { clipId } = useParams();
  const location = useLocation();
  const stateClips = useMemo(() => location.state?.clips || [], [location.state]);
  const { data, isLoading } = useCreatorDashboard({
    enabled: stateClips.length === 0,
  });

  const orderedClips = useMemo(() => {
    const clips = stateClips.length > 0 ? stateClips : data?.clips || [];
    const selectedIndex = clips.findIndex((clip) => clip._id === clipId);

    if (selectedIndex <= 0) {
      return clips;
    }

    return [...clips.slice(selectedIndex), ...clips.slice(0, selectedIndex)];
  }, [clipId, data?.clips, stateClips]);

  if (isLoading && stateClips.length === 0) {
    return (
      <>
        <FeedSkeleton />
        <FeedSkeleton />
      </>
    );
  }

  return (
    <FeedLayout>
      <ClipFeed items={orderedClips} hasMore={false} loadMore={() => Promise.resolve()} />
    </FeedLayout>
  );
};

export default ProfileClipFeed;
