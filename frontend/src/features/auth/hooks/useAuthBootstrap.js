import { useEffect } from "react";

import api from "../../../lib/api";

import useAuthStore from "../../../store/authStore";

export function useAuthBootstrap() {
  const setUser = useAuthStore((state) => state.setUser);

  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const { data } = await api.get("/auth/me");

        setUser(data.user);
      } catch {
        clearUser();
      }
    };

    bootstrap();
  }, [setUser, clearUser]);
}
