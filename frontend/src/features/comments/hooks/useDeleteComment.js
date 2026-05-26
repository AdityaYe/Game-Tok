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

    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: [
          "comments",
          clipId,
        ],
      });

      const previousComments = queryClient.getQueryData([
        "comments",
        clipId,
      ]);
      const previousFeed = queryClient.getQueryData(["feed"]);

      queryClient.setQueryData([
        "comments",
        clipId,
      ], (oldData) => ({
        ...(oldData || {}),
        comments: (oldData?.comments || []).filter(
          (comment) => comment._id !== commentId,
        ),
      }));

      queryClient.setQueryData(["feed"], (oldData) => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            clips: page.clips.map((clip) => {
              if (clip._id !== clipId) {
                return clip;
              }

              return {
                ...clip,
                commentCount: Math.max((clip.commentCount || 0) - 1, 0),
              };
            }),
          })),
        };
      });

      return {
        previousComments,
        previousFeed,
      };
    },

    onError: (err, commentId, context) => {
      queryClient.setQueryData([
        "comments",
        clipId,
      ], context?.previousComments);

      queryClient.setQueryData(["feed"], context?.previousFeed);
    },
  });
}
