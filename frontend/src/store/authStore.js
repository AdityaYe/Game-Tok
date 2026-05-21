import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,

  isAuthenticated: false,

  status: "idle",

  setAuthLoading: () =>
    set({
      status: "loading",
    }),

  setUser: (user) =>
    set({
      user,

      isAuthenticated: !!user,

      status: user ? "authenticated" : "guest",
    }),

  clearUser: () =>
    set({
      user: null,

      isAuthenticated: false,

      status: "guest",
    }),

  logout: () =>
    set({
      user: null,

      isAuthenticated: false,

      status: "guest",
    }),
}));

export default useAuthStore;
