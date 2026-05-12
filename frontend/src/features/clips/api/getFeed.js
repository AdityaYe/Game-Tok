import api from "@/lib/api";

export async function getFeed(page) {
  const { data } =
    await api.get(
      `/clips?page=${page}&limit=5`
    );

  return data;
}