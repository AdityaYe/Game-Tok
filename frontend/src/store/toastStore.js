import { create } from "zustand";

const useToastStore = create((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Date.now();

    set((state) => ({
      toasts: [
        ...state.toasts,

        {
          id,

          type: toast.type || "info",

          message: toast.message,
        },
      ],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },
}));

export default useToastStore;
