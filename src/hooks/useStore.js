import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      cart: {
        productos: [],
        total: 0,
        totalArticulos: 0,
        cargando: false
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
            cargando: false
          }
        });
      },
      setCart: (cart) => set({ cart }),

      setCartLoading: (cargando) => set((state) => ({ 
        cart: { ...state.cart, cargando } 
      })),

    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);