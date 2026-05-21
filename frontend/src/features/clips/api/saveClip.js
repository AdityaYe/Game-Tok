import api, { unwrapApiData } from "../../../lib/api";

export async function saveClip(
  clipId
) {

  const response = await api.post(`/clips/${clipId}/save`);

  return unwrapApiData(response);
}
