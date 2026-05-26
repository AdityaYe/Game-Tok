import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { addComment }
from "../api/addComment";
import useAuthStore from "../../../store/authStore";

export function useAddComment(
  clipId
) {

  const queryClient =
    useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({

    mutationFn: addComment,

    onMutate: async ({ text }) => {
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
      const optimisticComment = {
        _id: `temp-${Date.now()}`,
        clip: clipId,
        text,
        user,
        createdAt: new Date().toISOString(),
        optimistic: true,
      };

      queryClient.setQueryData([
        "comments",
        clipId,
      ], (oldData) => ({
        ...(oldData || {}),
        comments: [
          optimisticComment,
          ...((oldData?.comments) || []),
        ],
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
                commentCount: (clip.commentCount || 0) + 1,
              };
            }),
          })),
        };
      });

      return {
        optimisticId: optimisticComment._id,
        previousComments,
        previousFeed,
      };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData([
        "comments",
        clipId,
      ], context?.previousComments);

      queryClient.setQueryData(["feed"], context?.previousFeed);
    },

    onSuccess: (data, variables, context) => {
      const createdComment = data?.comment;

      if (!createdComment) {
        return;
      }

      queryClient.setQueryData([
        "comments",
        clipId,
      ], (oldData) => ({
        ...(oldData || {}),
        comments: (oldData?.comments || []).map((comment) => {
          if (comment._id !== context?.optimisticId) {
            return comment;
          }

          return {
            ...createdComment,
            user,
          };
        }),
      }));
    },
  });
}
