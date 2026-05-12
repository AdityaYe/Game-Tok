import { useQuery } from "@tanstack/react-query";

import { searchAll } from "../api/searchAll";

export function useSearch(query) {
  return useQuery({
    queryKey: ["search", query],

    queryFn: () => searchAll(query),

    enabled: !!query.trim(),

    staleTime: 1000 * 60 * 5,
  });
}
