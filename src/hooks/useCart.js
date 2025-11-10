import { useState, useEffect, useCallback } from "react";
import { useStore } from "./useStore";
import {
  obtenerCarrito,
  agregarProducto,
  actualizarCantidad,
  eliminarProducto,
  limpiarCarrito as limpiarCarritoServicio,
} from "../services/carritoService";
import toast from "react-hot-toast";

/**
 * Hook personalizado para manejar la lógica del carrito
 * @returns {Object} Estado y funciones para manejar el carrito
 */
export const useCart = () => {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [total, setTotal] = useState(0);
  const { token } = useStore();

  /**
   * Carga el carrito del usuario desde el servidor
   */
  const cargarCarrito = useCallback(async () => {
    try {
      setCargando(true);
      const carritoData = await obtenerCarrito();
      setArticulos(carritoData?.productos || []);
      setTotal(carritoData?.total || 0);
    } catch (error) {
      console.error("Error al cargar carrito:", error);
      toast.error("Error al cargar el carrito");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      cargarCarrito();
    } else {
      setArticulos([]);
      setTotal(0);
      setCargando(false);
    }
  }, [token, cargarCarrito]);

  /**
   * Agrega un producto al carrito
   * @param {Object} producto - Objeto del producto
   * @param {number} cantidad - Cantidad a agregar (default: 1)
   */
  const añadirAlCarrito = useCallback(
    async (producto, cantidad = 1) => {
      if (!token) {
        toast.error("Debes iniciar sesión para agregar productos al carrito");
        return;
      }

      try {
        setLoading(true);
        const response = await agregarProducto(
          producto.id || producto._id,
          cantidad
        );
        const carritoActualizado = response?.carrito || response;
        setArticulos(carritoActualizado?.productos || []);
        setTotal(carritoActualizado?.total || 0);
        toast.success("Producto agregado al carrito");
      } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        const mensaje =
          error.response?.data?.mensaje ||
          error.response?.data?.msg ||
          "Error al agregar producto al carrito";
        toast.error(mensaje);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  /**
   * Elimina un producto del carrito
   * @param {string} idProducto - ID del producto a eliminar
   */
  const quitarDelCarrito = useCallback(
    async (idProducto) => {
      if (!token) {
        toast.error("Debes iniciar sesión para modificar el carrito");
        return;
      }

      try {
        setLoading(true);
        const response = await eliminarProducto(idProducto);
        const carritoActualizado = response?.carrito || response;
        setArticulos(carritoActualizado?.productos || []);
        setTotal(carritoActualizado?.total || 0);
        toast.success("Producto eliminado del carrito");
      } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        const mensaje =
          error.response?.data?.mensaje ||
          error.response?.data?.msg ||
          "Error al eliminar producto del carrito";
        toast.error(mensaje);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  /**
   * Actualiza la cantidad de un producto en el carrito
   * @param {string} idProducto - ID del producto
   * @param {number} cantidad - Nueva cantidad
   */
  const actualizarCantidadProducto = useCallback(
    async (idProducto, cantidad) => {
      if (!token) {
        toast.error("Debes iniciar sesión para modificar el carrito");
        return;
      }

      if (cantidad < 1) {
        toast.error("La cantidad debe ser mayor a 0");
        return;
      }

      try {
        setLoading(true);
        const response = await actualizarCantidad(idProducto, cantidad);
        const carritoActualizado = response?.carrito || response;
        setArticulos(carritoActualizado?.productos || []);
        setTotal(carritoActualizado?.total || 0);
      } catch (error) {
        console.error("Error al actualizar cantidad:", error);
        const mensaje =
          error.response?.data?.mensaje ||
          error.response?.data?.msg ||
          "Error al actualizar cantidad";
        toast.error(mensaje);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  /**
   * Limpia todo el carrito
   */
  const limpiarCarrito = useCallback(async () => {
    if (!token) {
      toast.error("Debes iniciar sesión para modificar el carrito");
      return;
    }

    try {
      setLoading(true);
      const response = await limpiarCarritoServicio();
      const carritoActualizado = response?.carrito || response;
      setArticulos(carritoActualizado?.productos || []);
      setTotal(carritoActualizado?.total || 0);
      toast.success("Carrito limpiado");
    } catch (error) {
      console.error("Error al limpiar carrito:", error);
      const mensaje =
        error.response?.data?.mensaje ||
        error.response?.data?.msg ||
        "Error al limpiar el carrito";
      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Calcular totales basados en los artículos actuales
  const totalArticulos = articulos.reduce(
    (acum, item) => acum + (item.cantidad || 0),
    0
  );
  const precioTotal = articulos.reduce(
    (acum, item) => acum + (item.precio || 0) * (item.cantidad || 0),
    0
  );

  return {
    articulos,
    loading,
    cargando,
    total,
    totalArticulos,
    precioTotal: total || precioTotal, // Usar el total del servidor si está disponible
    añadirAlCarrito,
    quitarDelCarrito,
    actualizarCantidad: actualizarCantidadProducto,
    limpiarCarrito,
    cargarCarrito,
  };
};

export default useCart;
