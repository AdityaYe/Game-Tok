import api, { unwrapApiData } from "../../../lib/api";

export async function getNotifications() {
  return unwrapApiData(await api.get("/notifications"));
}
