import { create } from "zustand";
import { persist } from "zustand/middleware";

// Limpieza automática al cargar el store
if (typeof window !== 'undefined') {
  try {
    if (localStorage.getItem('ecommerce-storage')) {
      localStorage.removeItem('ecommerce-storage');
    }
  } catch (error) {
    // Silencioso
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

      setUser: (userData, token) => {
        set({ user: userData, token });
      },

      // 🔹 Limpia la sesión (logout)
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
        });
      },
      setCart: (cart) => set({ cart }),

      setCartLoading: (cargando) =>
        set((state) => ({
          cart: { ...state.cart, cargando },
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