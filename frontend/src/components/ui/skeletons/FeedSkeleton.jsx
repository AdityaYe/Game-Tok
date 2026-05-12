import React from "react";

import "../../../styles/skeleton.css";

const FeedSkeleton = () => {
  return (
    <div
      className="
      feed-skeleton
    "
    >
      <div
        className="
        skeleton-video
      "
      />

      <div
        className="
        skeleton-content
      "
      >
        <div
          className="
          skeleton-line
          short
        "
        />

        <div
          className="
          skeleton-line
        "
        />

        <div
          className="
          skeleton-line
          medium
        "
        />
      </div>
    </div>
  );
};

export default FeedSkeleton;
