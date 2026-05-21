import { useInfiniteQuery }
from "@tanstack/react-query";

import { getFeed }
from "../api/getFeed";

export function useFeed() {

  return useInfiniteQuery({

    queryKey: ["feed"],

    queryFn: ({
      pageParam = 1,
    }) => getFeed(pageParam),

    getNextPageParam: (
      lastPage,
      pages
    ) => {

      return lastPage.pagination?.hasMore
        ? pages.length + 1
        : undefined;
    },
  });
}
