import api from "../../../lib/api";

export async function likeClip(
  clipId
) {

  const { data } =
    await api.post(
      `/clips/${clipId}/like`
    );

  return data;
}