import { create } from "zustand";
import clientAxios from "../utils/clientAxios";

export const useCategoriesStore = create((set, get) => ({
  categorias: [],
  loading: false,
  error: null,

  // Obtener todas las categorías
  fetchCategorias: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await clientAxios.get("/categorias");
      set({ categorias: data.data || data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Obtener categoría por ID
  fetchCategoriaPorId: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await clientAxios.get(`/categorias/${id}`);
      set({ loading: false });
      return data.data || data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Crear nueva categoría
  crearCategoria: async (datos) => {
    set({ loading: true, error: null });
    try {
      const { data } = await clientAxios.post("/categorias", datos);
      // Actualizar lista de categorías
      await get().fetchCategorias();
      set({ loading: false });
      return data.data || data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Actualizar categoría
  actualizarCategoria: async (id, datos) => {
    set({ loading: true, error: null });
    try {
      const { data } = await clientAxios.put(`/categorias/${id}`, datos);
      // Actualizar lista de categorías
      await get().fetchCategorias();
      set({ loading: false });
      return data.data || data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Eliminar categoría
  eliminarCategoria: async (id) => {
    set({ loading: true, error: null });
    try {
      await clientAxios.delete(`/categorias/${id}`);
      // Actualizar lista de categorías
      await get().fetchCategorias();
      set({ loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Desactivar categoría
  desactivarCategoria: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await clientAxios.patch(`/categorias/${id}/desactivar`);
      // Actualizar lista de categorías
      await get().fetchCategorias();
      set({ loading: false });
      return data.data || data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Limpiar errores
  clearError: () => set({ error: null }),
}));
