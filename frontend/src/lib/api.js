import axios from "axios";
import useAuthStore from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearUser();
    }

    return Promise.reject(error);
  },
);

export function unwrapApiData(response) {
  return response.data?.data ?? response.data;
}

export default api;
