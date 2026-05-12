import { useMutation, useQueryClient } from "@tanstack/react-query";

import { saveClip } from "../api/saveClip";

export function useSaveClip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveClip,

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

                  savesCount: (clip.savesCount || 0) + 1,
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
      queryClient.setQueryData(["feed"], context.previousFeed);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["feed"],
      });
    },
  });
}
