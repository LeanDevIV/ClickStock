import { create } from "zustand";
import clientAxios from "../utils/clientAxios";

export const usePromocionStore = create((set) => ({
  // Estado
  promociones: [],
  loading: false,
  error: null,

  // 🔹 Crear promoción
  crearPromocion: async (data) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("titulo", data.titulo);
      formData.append("descripcion", data.descripcion);
      formData.append("descuento", data.descuento);
      formData.append("fechaInicio", data.fechaInicio);
      formData.append("fechaFin", data.fechaFin);
      if (data.imagen) {
        formData.append("imagen", data.imagen);
      }

      const response = await clientAxios.post("/promociones", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({
        promociones: [...state.promociones, response.data],
        loading: false,
      }));

      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Error al crear promoción";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // 🔹 Obtener todas las promociones
  obtenerPromociones: async () => {
    set({ loading: true, error: null });
    try {
      const response = await clientAxios.get("/promociones");
      set({ promociones: response.data, loading: false });
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Error al obtener promociones";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // 🔹 Obtener promoción por ID
  obtenerPromocionPorId: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await clientAxios.get(`/promociones/${id}`);
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Error al obtener la promoción";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // 🔹 Actualizar promoción
  actualizarPromocion: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("titulo", data.titulo);
      formData.append("descripcion", data.descripcion);
      formData.append("descuento", data.descuento);
      formData.append("fechaInicio", data.fechaInicio);
      formData.append("fechaFin", data.fechaFin);
      if (data.imagen && typeof data.imagen !== "string") {
        formData.append("imagen", data.imagen);
      }

      const response = await clientAxios.put(`/promociones/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({
        promociones: state.promociones.map((p) =>
          p._id === id ? response.data : p
        ),
        loading: false,
      }));

      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Error al actualizar promoción";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // 🔹 Eliminar promoción
  eliminarPromocion: async (id) => {
    set({ loading: true, error: null });
    try {
      await clientAxios.delete(`/promociones/${id}`);
      set((state) => ({
        promociones: state.promociones.filter((p) => p._id !== id),
        loading: false,
      }));
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Error al eliminar promoción";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // 🔹 Limpiar estado
  limpiarError: () => set({ error: null }),
  resetPromociones: () => set({ promociones: [], error: null, loading: false }),
}));
