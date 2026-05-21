import api, { unwrapApiData } from "../../../lib/api";

export async function getCreatorProfile(id) {
  return unwrapApiData(await api.get(`/creator/${id}`));
}

export async function getCreatorDashboard() {
  return unwrapApiData(await api.get("/dashboard"));
}

export async function updateCreatorAvatar(formData) {
  return unwrapApiData(await api.put("/creator/avatar", formData));
}

export async function updateCreatorProfile(payload) {
  return unwrapApiData(await api.put("/creator/profile", payload));
}

export async function updateDashboardClip({ clipId, payload }) {
  return unwrapApiData(await api.put(`/dashboard/${clipId}`, payload));
}

export async function deleteDashboardClip(clipId) {
  return unwrapApiData(await api.delete(`/dashboard/${clipId}`));
}
