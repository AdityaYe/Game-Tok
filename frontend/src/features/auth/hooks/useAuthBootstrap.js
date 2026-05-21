import { useEffect } from "react";

import useAuthStore from "../../../store/authStore";
import { getMe } from "../api/getMe";

export function useAuthBootstrap() {
  const setUser = useAuthStore((state) => state.setUser);

  const clearUser = useAuthStore((state) => state.clearUser);

  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);

  useEffect(() => {
    let isMounted = true;

    setAuthLoading();

    const bootstrap = async () => {
      try {
        const data = await getMe();

        if (isMounted) {
          setUser(data.user);
        }
      } catch {
        if (isMounted) {
          clearUser();
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [setUser, clearUser, setAuthLoading]);
}
