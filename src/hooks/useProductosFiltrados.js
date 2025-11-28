import { useState, useEffect } from 'react';
import clientAxios from "../utils/clientAxios";

export const useProductosFiltrados = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ USAR LOS PARÁMETROS CORRECTOS DEL BACKEND
        const [respuestaProductos, respuestaCategorias] = await Promise.all([
          clientAxios.get('/productos', {
            params: {
              includeDeleted: false,      // = isDeleted: false
              includeUnavailable: false   // = disponible: true
            }
          }),
          clientAxios.get('/categorias')
        ]);

        let datosProductos = respuestaProductos.data || [];
        
        // ✅ EL BACKEND YA FILTRA, SOLO QUITAR PRODUCTOS SIN STOCK
        datosProductos = datosProductos.filter(producto => producto.stock > 0);
        
        console.log('✅ Productos cargados:', datosProductos);

        // Procesar categorías
        let datosCategorias = respuestaCategorias.data || [];
        if (datosCategorias.data && Array.isArray(datosCategorias.data)) {
          datosCategorias = datosCategorias.data;
        } else if (datosCategorias && typeof datosCategorias === 'object' && !Array.isArray(datosCategorias)) {
          datosCategorias = Object.values(datosCategorias);
        }
        if (!Array.isArray(datosCategorias)) datosCategorias = [];

        console.log('✅ Categorías cargadas:', datosCategorias);
        
        setProductos(datosProductos);
        setCategorias(datosCategorias);

      } catch (err) {
        console.error('Error completo:', err);
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Filtrado por categoría (solo esto queda en el frontend)
  const productosFiltrados = categoriaSeleccionada === 'todos' 
    ? productos  // Ya están filtrados por stock
    : productos.filter(producto => {
        if (!producto.categoria) return false;
        const idCategoria = producto.categoria._id || producto.categoria;
        return idCategoria === categoriaSeleccionada;
      });

  const productosDestacados = productos.slice(0, 3);

  const manejarCambioCategoria = (evento, nuevoValor) => {
    setCategoriaSeleccionada(nuevoValor);
  };

  const obtenerUrlImagen = (producto) => {
    if (producto.imagenes && Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
      const primeraImagen = producto.imagenes[0];
      if (primeraImagen.startsWith('http')) {
        return primeraImagen;
      }
      return `http://localhost:5000${primeraImagen.startsWith('/') ? '' : '/'}${primeraImagen}`;
    }
    return null;
  };

  return {
    productos,
    categorias,
    categoriaSeleccionada,
    productosFiltrados,
    productosDestacados,
    loading,
    error,
    manejarCambioCategoria,
    obtenerUrlImagen
  };
};