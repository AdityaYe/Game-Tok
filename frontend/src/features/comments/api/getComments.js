import api from "../../../lib/api";

export async function getComments(clipId) {
  const { data } = await api.get(`/clips/${clipId}/comments`);

  return data;
}
