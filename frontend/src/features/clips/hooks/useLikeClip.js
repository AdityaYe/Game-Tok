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

                return {
                  ...clip,

                  likeCount: (clip.likeCount || 0) + 1,
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

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["feed"],
      });
    },
  });
}
