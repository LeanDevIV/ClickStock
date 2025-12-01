import { useState, useEffect } from "react";
import clientAxios from "../utils/clientAxios";

export const useProductosFiltrados = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);

        const [respuestaProductos, respuestaCategorias] = await Promise.all([
          clientAxios.get("/productos", {
            params: {
              includeDeleted: false,
              includeUnavailable: false,
            },
          }),
          clientAxios.get("/categorias"),
        ]);

        let datosProductos = respuestaProductos.data || [];
        datosProductos = datosProductos.filter(
          (producto) => producto.stock > 0
        );
        setProductos(datosProductos);

        let datosCategorias = respuestaCategorias.data;

        // Verificar si viene envuelto en { success: true, data: [...] }
        if (
          datosCategorias &&
          datosCategorias.data &&
          Array.isArray(datosCategorias.data)
        ) {
          datosCategorias = datosCategorias.data;
        }

        // Asegurar que sea un array
        if (!Array.isArray(datosCategorias)) {
          datosCategorias = [];
        }

        setCategorias(datosCategorias);
      } catch (error) {
        console.error(error);
        setError(
          "Lo sentimos, hubo un error al cargar los productos. Por favor, inténtalo de nuevo."
        );
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const productosFiltrados =
    categoriaSeleccionada === "todos"
      ? productos
      : productos.filter((producto) => {
          if (!producto.categoria) return false;
          const idCategoria = producto.categoria._id || producto.categoria;
          return idCategoria === categoriaSeleccionada;
        });

  const productosDestacados = productos.slice(0, 3);

  const manejarCambioCategoria = (evento, nuevoValor) => {
    setCategoriaSeleccionada(nuevoValor);
  };

  const obtenerUrlImagen = (producto) => {
    if (
      producto.imagenes &&
      Array.isArray(producto.imagenes) &&
      producto.imagenes.length > 0
    ) {
      const primeraImagen = producto.imagenes[0];
      let urlFinal;

      if (primeraImagen.startsWith("http")) {
        urlFinal = primeraImagen;
      } else {
        const baseUrl =
          import.meta.env.VITE_API_URL?.replace("/api", "") ||
          "http://localhost:5000";
        const serverUrl = baseUrl.replace("/api", "");
        urlFinal = `${serverUrl}${
          primeraImagen.startsWith("/") ? "" : "/"
        }${primeraImagen}`;
      }

      return urlFinal;
    }

    return null;
  };

  const categoriasVisibles = categorias.filter((categoria) =>
    productos.some((producto) => {
      const idCategoria = producto.categoria._id || producto.categoria;
      return idCategoria === categoria._id;
    })
  );

  return {
    productos,
    categorias: categoriasVisibles,
    categoriaSeleccionada,
    productosFiltrados,
    productosDestacados,
    loading,
    error,
    manejarCambioCategoria,
    obtenerUrlImagen,
  };
};
