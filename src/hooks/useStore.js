import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      // 🔹 Guarda el usuario y token
      setUser: (userData, token) => {
        set({ user: userData, token });
      },

      // 🔹 Limpia la sesión (logout)
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage", // nombre del storage
      getStorage: () => localStorage, // usa localStorage
    }
  )
);
