import api, { unwrapApiData } from "@/lib/api";

export async function getFollowingFeed(page, creatorId = "") {
  const params = new URLSearchParams({
    page: String(page),
    limit: "5",
  });

  if (creatorId) {
    params.set("creatorId", creatorId);
  }

  const response = await api.get(`/clips/following?${params.toString()}`);

  return unwrapApiData(response);
}
