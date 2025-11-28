import { useCallback } from "react";
import { useStore } from "./useStore";
import {
  obtenerCarrito,
  agregarProducto,
  actualizarCantidad,
  eliminarProducto,
  limpiarCarrito as limpiarCarritoServicio,
} from "../services/carritoService";
import toast from "react-hot-toast";

export const useCart = () => {
  const { cart, setCart, setCartLoading, token } = useStore();

  /**
   * Carga el carrito del usuario desde el servidor
   */
  const cargarCarrito = useCallback(async () => {
    if (!token) {
      setCart({ productos: [], total: 0, totalArticulos: 0 });
      return;
    }

    try {
      setCartLoading(true);
      const carritoData = await obtenerCarrito();
      const totalArticulos =
        carritoData?.productos?.reduce(
          (total, item) => total + (item.cantidad || 0),
          0
        ) || 0;

      setCart({
        productos: carritoData?.productos || [],
        total: carritoData?.total || 0,
        totalArticulos: totalArticulos,
      });
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error("Error al cargar el carrito", {
          position: "top-center",
          duration: 2000,
        });
      }
    } finally {
      setCartLoading(false);
    }
  }, [token, setCart, setCartLoading]);

  /**
   * Agrega un producto al carrito
   */
  const añadirAlCarrito = useCallback(
    async (producto, cantidad = 1) => {
      if (!token) {
        toast.error("Debes iniciar sesión para agregar productos al carrito", {
          position: "top-center",
          duration: 2000,
        });
        return;
      }

      try {
        setCartLoading(true);

        const productId = producto._id?.toString() || producto.id?.toString();

        if (!productId) {
          throw new Error("ID del producto no válido");
        }

        const response = await agregarProducto(productId, cantidad);
        const carritoActualizado = response?.carrito || response;
        const totalArticulos =
          carritoActualizado?.productos?.reduce(
            (total, item) => total + (item.cantidad || 0),
            0
          ) || 0;

        setCart({
          productos: carritoActualizado?.productos || [],
          total: carritoActualizado?.total || 0,
          totalArticulos: totalArticulos,
        });

        toast.success("Producto agregado al carrito", {
          position: "top-center",
          duration: 2000,
        });
      } catch (error) {
        const mensaje =
          error.response?.data?.mensaje ||
          error.response?.data?.msg ||
          "Error al agregar producto al carrito";
        toast.error(mensaje, {
          position: "top-center",
          duration: 2000,
        });
      } finally {
        setCartLoading(false);
      }
    },
    [token, setCart, setCartLoading]
  );

  /**
   * Elimina un producto del carrito
   */
  const quitarDelCarrito = useCallback(
    async (idProducto) => {
      if (!token) {
        toast.error("Debes iniciar sesión para modificar el carrito", {
          position: "top-center",
          duration: 2000,
        });
        return;
      }

      try {
        setCartLoading(true);
        const response = await eliminarProducto(idProducto);
        const carritoActualizado = response?.carrito || response;
        const totalArticulos =
          carritoActualizado?.productos?.reduce(
            (total, item) => total + (item.cantidad || 0),
            0
          ) || 0;

        setCart({
          productos: carritoActualizado?.productos || [],
          total: carritoActualizado?.total || 0,
          totalArticulos: totalArticulos,
        });

        toast.success("Producto eliminado del carrito", {
          position: "top-center",
          duration: 2000,
        });
      } catch (error) {
        const mensaje =
          error.response?.data?.mensaje ||
          error.response?.data?.msg ||
          "Error al eliminar producto del carrito";
        toast.error(mensaje, {
          position: "top-center",
          duration: 2000,
        });
      } finally {
        setCartLoading(false);
      }
    },
    [token, setCart, setCartLoading]
  );

  /**
   * Actualiza la cantidad de un producto en el carrito
   */
  const actualizarCantidadProducto = useCallback(
    async (idProducto, cantidad) => {
      if (!token) {
        toast.error("Debes iniciar sesión para modificar el carrito", {
          position: "top-center",
          duration: 2000,
        });
        return;
      }

      if (cantidad < 1) {
        toast.error("La cantidad debe ser mayor a 0", {
          position: "top-center",
          duration: 2000,
        });
        return;
      }

      try {
        setCartLoading(true);
        const response = await actualizarCantidad(idProducto, cantidad);
        const carritoActualizado = response?.carrito || response;
        const totalArticulos =
          carritoActualizado?.productos?.reduce(
            (total, item) => total + (item.cantidad || 0),
            0
          ) || 0;

        setCart({
          productos: carritoActualizado?.productos || [],
          total: carritoActualizado?.total || 0,
          totalArticulos: totalArticulos,
        });
      } catch (error) {
        const mensaje =
          error.response?.data?.mensaje ||
          error.response?.data?.msg ||
          "Error al actualizar cantidad";
        toast.error(mensaje, {
          position: "top-center",
          duration: 2000,
        });
      } finally {
        setCartLoading(false);
      }
    },
    [token, setCart, setCartLoading]
  );

  /**
   * Limpia todo el carrito
   */
  const limpiarCarrito = useCallback(async () => {
    if (!token) {
      toast.error("Debes iniciar sesión para modificar el carrito", {
        position: "top-center",
        duration: 2000,
      });
      return;
    }

    try {
      setCartLoading(true);
      const response = await limpiarCarritoServicio();
      const carritoActualizado = response?.carrito || response;

      setCart({
        productos: carritoActualizado?.productos || [],
        total: carritoActualizado?.total || 0,
        totalArticulos: 0,
      });

      toast.success("Carrito limpiado", {
        position: "top-center",
        duration: 2000,
      });
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje ||
        error.response?.data?.msg ||
        "Error al limpiar el carrito";
      toast.error(mensaje, {
        position: "top-center",
        duration: 2000,
      });
    } finally {
      setCartLoading(false);
    }
  }, [token, setCart, setCartLoading]);

  return {
    articulos: cart.productos || [],
    loading: cart.cargando || false,
    cargando: cart.cargando || false,
    total: cart.total || 0,
    totalArticulos: cart.totalArticulos || 0,
    precioTotal: cart.total || 0,
    añadirAlCarrito,
    quitarDelCarrito,
    actualizarCantidad: actualizarCantidadProducto,
    limpiarCarrito,
    cargarCarrito,
  };
};

export default useCart;