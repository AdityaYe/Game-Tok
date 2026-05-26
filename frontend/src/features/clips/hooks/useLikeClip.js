import { useMutation, useQueryClient } from "@tanstack/react-query";

import { likeClip } from "../api/likeClip";
import useToastStore from "../../../store/toastStore";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export function useLikeClip() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: likeClip,

    onMutate: async (clipId) => {
      await queryClient.cancelQueries({
        queryKey: ["feed"],
      });

      const previousFeed = queryClient.getQueryData(["feed"]);

      queryClient.setQueryData(
        ["feed"],

        (oldData) => {
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

                const nextLiked =
                  typeof clip.liked === "boolean" ? !clip.liked : true;
                const countDelta = nextLiked ? 1 : -1;

                return {
                  ...clip,

                  liked: nextLiked,

                  likeCount: Math.max((clip.likeCount || 0) + countDelta, 0),
                };
              }),
            })),
          };
        },
      );

      return {
        previousFeed,
      };
    },

    onError: (err, clipId, context) => {
      queryClient.setQueryData(["feed"], context?.previousFeed);

      addToast({
        type: "error",

        message: getErrorMessage(err),
      });
    },

    onSuccess: (data, clipId, context) => {
      const liked = data?.liked;

      if (typeof liked !== "boolean") {
        return;
      }

      const previousClip = context?.previousFeed?.pages
        ?.flatMap((page) => page.clips || [])
        .find((clip) => clip._id === clipId);

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
                liked,
                likeCount:
                  typeof previousClip?.likeCount === "number"
                    ? Math.max(previousClip.likeCount + (liked ? 1 : -1), 0)
                    : clip.likeCount,
              };
            }),
          })),
        };
      });
    },
  });
}
