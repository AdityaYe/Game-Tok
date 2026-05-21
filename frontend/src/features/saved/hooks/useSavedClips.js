import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSavedClips, toggleSavedClip } from "../api/savedApi";

export function useSavedClips() {
  return useQuery({
    queryKey: ["saved-clips"],
    queryFn: getSavedClips,
  });
}

export function useRemoveSavedClip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleSavedClip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-clips"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}
