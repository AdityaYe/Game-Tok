import { useQuery } from "@tanstack/react-query";
import { getCreatorProfile } from "../api/creatorApi";

export function useCreatorProfile(id) {
  return useQuery({
    queryKey: ["creator-profile", id],
    queryFn: () => getCreatorProfile(id),
    enabled: !!id,
  });
}
