import api from "../../../lib/api";

export async function addComment({ clipId, text }) {
  const { data } = await api.post(`/clips/${clipId}/comments`, { text });

  return data;
}
