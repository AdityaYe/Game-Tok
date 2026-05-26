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

                const nextSaved =
                  typeof clip.saved === "boolean" ? !clip.saved : true;
                const countDelta = nextSaved ? 1 : -1;

                return {
                  ...clip,

                  saved: nextSaved,

                  savesCount: Math.max((clip.savesCount || 0) + countDelta, 0),
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
    },

    onSuccess: (data, clipId, context) => {
      const saved = data?.saved;

      if (typeof saved !== "boolean") {
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
                saved,
                savesCount:
                  typeof previousClip?.savesCount === "number"
                    ? Math.max(previousClip.savesCount + (saved ? 1 : -1), 0)
                    : clip.savesCount,
              };
            }),
          })),
        };
      });
    },
  });
}
