import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { addComment }
from "../api/addComment";

export function useAddComment(
  clipId
) {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: addComment,

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