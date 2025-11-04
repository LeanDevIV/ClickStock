import axios from "axios";
import { useStore } from "../hooks/useStore.js";

const clientAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// 🔹 Interceptor para incluir token si existe
clientAxios.interceptors.request.use((config) => {
  const token = useStore.getState().token || localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔹 Si el token es inválido o expiró, desloguea al usuario
clientAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - cerrando sesión...");
      useStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default clientAxios;
