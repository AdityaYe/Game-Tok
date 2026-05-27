import { useInfiniteQuery } from "@tanstack/react-query";

import { getFollowingFeed } from "../api/getFollowingFeed";

export function useFollowingFeed(creatorId = "") {
  return useInfiniteQuery({
    queryKey: ["following-feed", creatorId],
    queryFn: ({ pageParam = 1 }) => getFollowingFeed(pageParam, creatorId),
    getNextPageParam: (lastPage, pages) =>
      lastPage.pagination?.hasMore ? pages.length + 1 : undefined,
  });
}
