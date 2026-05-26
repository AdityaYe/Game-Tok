import api, { unwrapApiData } from "../../../lib/api";

export async function getNotifications() {
  return unwrapApiData(await api.get("/notifications"));
}

export async function markNotificationsRead() {
  return unwrapApiData(await api.post("/notifications/read"));
}
