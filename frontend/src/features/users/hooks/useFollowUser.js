import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unfollowUser } from "../api/followUser";

export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, following }) =>
      following ? unfollowUser(userId) : followUser(userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["creator-profile", variables.userId],
      });
    },
  });
}
