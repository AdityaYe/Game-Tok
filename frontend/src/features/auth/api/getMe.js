import api, { unwrapApiData } from "../../../lib/api";

export async function getMe() {
  const response = await api.get("/auth/me");

  return unwrapApiData(response);
}
