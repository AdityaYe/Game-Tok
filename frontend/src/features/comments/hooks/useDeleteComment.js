import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteComment }
from "../api/deleteComment";

export function useDeleteComment(
  clipId
) {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn:
      deleteComment,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: [
          "comments",
          clipId,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["feed"],
      });
    },
  });
}