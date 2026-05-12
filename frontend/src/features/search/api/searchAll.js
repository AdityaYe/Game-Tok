import api from "../../../lib/api";

export async function searchAll(query) {
  const { data } = await api.get(`/search?q=${query}`);

  return data;
}
