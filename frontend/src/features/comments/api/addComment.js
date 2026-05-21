import api, { unwrapApiData } from "../../../lib/api";

export async function addComment({ clipId, text }) {
  const response = await api.post(`/clips/${clipId}/comments`, { text });

  return unwrapApiData(response);
}
