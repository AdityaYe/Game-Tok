import api from "../../../lib/api";

export async function saveClip(
  clipId
) {

  const { data } =
    await api.post(
      `/clips/${clipId}/save`
    );

  return data;
}