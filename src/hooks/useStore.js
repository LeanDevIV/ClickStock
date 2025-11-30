import { create } from "zustand";
import { persist } from "zustand/middleware";

if (typeof window !== "undefined") {
  try {
    if (localStorage.getItem("ecommerce-storage")) {
      localStorage.removeItem("ecommerce-storage");
    }
  } catch (error) {
    console.error(error);
  }
}

export const useStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      cart: {
        productos: [],
        total: 0,
        totalArticulos: 0,
        cargando: false,
      },
      favoritos: [],

      setUser: (userData, token) => {
        set({ user: userData, token });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          cart: {
            productos: [],
            total: 0,
            totalArticulos: 0,
            cargando: false,
          },
          favoritos: [],
        });
      },
      setCart: (cart) => set({ cart }),

      setCartLoading: (cargando) =>
        set((state) => ({
          cart: { ...state.cart, cargando },
        })),

      setFavoritos: (favoritos) => set({ favoritos }),
      addFavorito: (id) =>
        set((state) => ({ favoritos: [...state.favoritos, id] })),
      removeFavorito: (id) =>
        set((state) => ({
          favoritos: state.favoritos.filter((favId) => favId !== id),
        })),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error(
            "Error al hidratar el estado desde localStorage:",
            error
          );
        }
      },
      serialize: (state) => {
        try {
          return JSON.stringify(state);
        } catch (error) {
          console.error("Error al serializar estado:", error);
          return "{}";
        }
      },
      deserialize: (str) => {
        try {
          return JSON.parse(str);
        } catch (error) {
          console.error("Error al deserializar estado:", error);
          return {};
        }
      },
    }
  )
);
