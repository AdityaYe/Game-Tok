import { useEffect }
from "react";

import { useQuery }
from "@tanstack/react-query";

import useAuthStore
from "../../../store/authStore";

import { getMe }
from "../api/getMe";

export function useAuth() {

  const setUser =
    useAuthStore(
      (state) =>
        state.setUser
    );

  const logout =
    useAuthStore(
      (state) =>
        state.logout
    );

  const query =
    useQuery({

      queryKey: ["me"],

      queryFn: getMe,

      retry: false,
    });

  useEffect(() => {

    if (query.data?.user) {

      setUser(
        query.data.user
      );

    } else if (query.isError) {

      logout();
    }

  }, [
    query.data,
    query.isError,
    setUser,
    logout,
  ]);

  return query;
}