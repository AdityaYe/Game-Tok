import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteDashboardClip,
  getCreatorDashboard,
  updateCreatorAvatar,
  updateCreatorProfile,
  updateDashboardClip,
} from "../api/creatorApi";

export function useCreatorDashboard(options = {}) {
  return useQuery({
    queryKey: ["creator-dashboard"],
    queryFn: getCreatorDashboard,
    ...options,
  });
}

export function useUpdateCreatorAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCreatorAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-dashboard"] });
    },
  });
}

export function useUpdateCreatorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCreatorProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-dashboard"] });
    },
  });
}

export function useUpdateDashboardClip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDashboardClip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}

export function useDeleteDashboardClip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDashboardClip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}
