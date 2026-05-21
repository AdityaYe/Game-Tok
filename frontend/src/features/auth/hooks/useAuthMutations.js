import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../../../store/authStore";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../api/authApi";

function getAuthenticatedUser(data) {
  return data?.user ?? null;
}

function useAuthMutation(mutationFn) {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      setUser(getAuthenticatedUser(data));
    },
  });
}

export function useUserLogin() {
  return useAuthMutation(loginUser);
}

export function useUserRegister() {
  return useAuthMutation(registerUser);
}

export function useLogout() {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      clearUser();
      queryClient.clear();
    },
  });
}
