import { useQuery } from "@tanstack/react-query";

import { getComments } from "../api/getComments";

export function useComments(clipId) {
  return useQuery({
    queryKey: ["comments", clipId],

    queryFn: () => getComments(clipId),

    enabled: !!clipId,
  });
}
