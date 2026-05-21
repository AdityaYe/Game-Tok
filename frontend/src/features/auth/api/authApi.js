import api, { unwrapApiData } from "../../../lib/api";

export async function loginUser(payload) {
  return unwrapApiData(await api.post("/auth/user/login", payload));
}

export async function registerUser(payload) {
  return unwrapApiData(await api.post("/auth/user/register", payload));
}

export async function logoutUser() {
  return unwrapApiData(await api.post("/auth/logout"));
}

export async function updateAuthProfile(payload) {
  return unwrapApiData(await api.patch("/auth/profile", payload));
}
