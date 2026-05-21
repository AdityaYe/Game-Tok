import api, { unwrapApiData } from "../../../lib/api";

export async function getComments(clipId) {
  const response = await api.get(`/clips/${clipId}/comments`);

  return unwrapApiData(response);
}
