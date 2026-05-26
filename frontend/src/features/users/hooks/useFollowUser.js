import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unfollowUser } from "../api/followUser";
import useAuthStore from "../../../store/authStore";

export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, following }) =>
      following ? unfollowUser(userId) : followUser(userId),
    onMutate: ({ userId, following }) => {
      const { setUser, user } = useAuthStore.getState();

      if (!user) {
        return {
          previousUser: user,
        };
      }

      const currentFollowing = user.following || [];
      const nextFollowing = following
        ? currentFollowing.filter((id) => String(id) !== String(userId))
        : [...currentFollowing, userId];

      setUser({
        ...user,
        following: nextFollowing,
        followingCount: Math.max(
          (user.followingCount ?? currentFollowing.length) + (following ? -1 : 1),
          0,
        ),
      });

      return {
        previousUser: user,
      };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousUser) {
        useAuthStore.getState().setUser(context.previousUser);
      }
    },
    onSuccess: (data, variables) => {
      const { setUser, user } = useAuthStore.getState();

      if (user && typeof data?.followingCount === "number") {
        setUser({
          ...user,
          followingCount: data.followingCount,
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["creator-profile", variables.userId],
      });
    },
  });
}
