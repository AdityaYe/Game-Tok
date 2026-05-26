import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationsRead } from "../api/notificationsApi";

export function useNotifications(options = {}) {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    ...options,
  });
}

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["notifications"],
      });

      const previousNotifications = queryClient.getQueryData(["notifications"]);

      queryClient.setQueryData(["notifications"], (oldData) => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          unreadCount: 0,
          notifications: (oldData.notifications || []).map((notification) => ({
            ...notification,
            isRead: true,
          })),
        };
      });

      return {
        previousNotifications,
      };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["notifications"],
        context?.previousNotifications,
      );
    },
  });
}
