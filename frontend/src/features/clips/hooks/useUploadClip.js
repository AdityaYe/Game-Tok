import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useState } from "react";

import { uploadClip } from "../api/uploadClip";

import useToastStore from "../../../store/toastStore";

import { getErrorMessage } from "../../../utils/getErrorMessage";

export function useUploadClip() {
  const queryClient = useQueryClient();

  const addToast = useToastStore((state) => state.addToast);

  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      return uploadClip({
        formData,

        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );

          setProgress(percent);
        },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["feed"],
      });

      setProgress(0);

      addToast({
        type: "success",

        message: "Clip uploaded successfully",
      });
    },

    onError: (err) => {
      setProgress(0);

      addToast({
        type: "error",

        message: getErrorMessage(err),
      });
    },
  });

  return {
    ...mutation,

    progress,
  };
}
