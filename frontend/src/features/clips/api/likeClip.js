import api, { unwrapApiData } from "../../../lib/api";

export async function likeClip(
  clipId
) {

  const response = await api.post(`/clips/${clipId}/like`);

  return unwrapApiData(response);
}
