import api, { unwrapApiData } from "../../../lib/api";

export async function getSavedClips() {
  return unwrapApiData(await api.get("/clips/saved"));
}

export async function toggleSavedClip(clipId) {
  return unwrapApiData(await api.post(`/clips/${clipId}/save`));
}
