import api, { unwrapApiData } from "../../../lib/api";

export async function searchAll(query) {
  const response = await api.get(`/search?q=${encodeURIComponent(query)}`);

  return unwrapApiData(response);
}
