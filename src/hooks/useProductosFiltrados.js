import { useState, useEffect } from 'react';
import clientAxios from "../../utils/clientAxios";

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
        
        const [respuestaProductos, respuestaCategorias] = await Promise.all([
          clientAxios.get('/productos', {
            params: {
              disponible: true,
              isDeleted: false
            }
          }),
          clientAxios.get('/categorias')
        ]);

        let datosProductos = respuestaProductos.data || [];
        if (datosProductos.data && Array.isArray(datosProductos.data)) {
          datosProductos = datosProductos.data;
        }
        if (!Array.isArray(datosProductos)) datosProductos = [];

        let datosCategorias = respuestaCategorias.data || [];
        if (datosCategorias.data && Array.isArray(datosCategorias.data)) {
          datosCategorias = datosCategorias.data;
        } else if (datosCategorias && typeof datosCategorias === 'object' && !Array.isArray(datosCategorias)) {
          datosCategorias = Object.values(datosCategorias);
        }
        if (!Array.isArray(datosCategorias)) datosCategorias = [];

        setProductos(datosProductos);
        setCategorias(datosCategorias);

      } catch (err) {
        setError('Error al cargar los productos');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const productosFiltrados = categoriaSeleccionada === 'todos' 
    ? productos.filter(producto => producto.stock > 0 && producto.disponible && !producto.isDeleted)
    : productos.filter(producto => {
        if (!producto.categoria) return false;
        const idCategoria = producto.categoria._id || producto.categoria;
        return idCategoria === categoriaSeleccionada && 
               producto.stock > 0 && 
               producto.disponible &&
               !producto.isDeleted;
      });

  const productosDestacados = productos
    .filter(producto => producto.stock > 0 && producto.disponible)
    .slice(0, 3);

  const manejarCambioCategoria = (evento, nuevoValor) => {
    setCategoriaSeleccionada(nuevoValor);
  };

  const obtenerUrlImagen = (producto) => {
    if (producto.imagenes && Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
      const primeraImagen = producto.imagenes[0];
      // Si ya es una URL completa, la devuelve tal cual
      if (primeraImagen.startsWith('http')) {
        return primeraImagen;
      }
      // Si es una ruta relativa, construye la URL completa con tu servidor
      return `http://localhost:5000${primeraImagen.startsWith('/') ? '' : '/'}${primeraImagen}`;
    }
    
    // Si no hay imágenes, puedes devolver un placeholder genérico o null
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