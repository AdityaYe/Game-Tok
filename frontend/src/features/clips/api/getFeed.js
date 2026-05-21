import api, { unwrapApiData } from "@/lib/api";

export async function getFeed(page) {
  const response = await api.get(`/clips?page=${page}&limit=5`);

  return unwrapApiData(response);
}
