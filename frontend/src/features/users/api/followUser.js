import api, { unwrapApiData } from "../../../lib/api";

export async function followUser(userId) {
  return unwrapApiData(await api.post(`/users/${userId}/follow`));
}

export async function unfollowUser(userId) {
  return unwrapApiData(await api.delete(`/users/${userId}/follow`));
}
