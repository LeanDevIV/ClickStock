import { useEffect, useState } from "react";
import clientAxios from "../utils/clientAxios";

function Products() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    obtenerProductos();
  }, []);
  async function obtenerProductos() {
    try {
      setLoading(true);
      const response = await clientAxios.get("/productos");
      
      const productosData = response.data?.productos || response.data;
      
      if (productosData && (Array.isArray(productosData) || typeof productosData === 'object')) {
        setProductos(productosData);
      } else {
        console.error("Los datos recibidos no tienen el formato esperado");
        setProductos([]);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      {loading ? <p>Cargando productos...</p> : null}
      <section>Página de productos</section>
      <ul>
       {Array.isArray(productos) && productos.length > 0 ? (
          productos.map((producto) => (
            <li key={producto._id}>{producto.nombre}</li>
          ))
        ) : (
          <li>No hay productos disponibles.</li>
        )}
      </ul>
      <section>Lista de productos se mostrará aquí.</section>
      <section>Componente de pie de página</section>
    </>
  );
}

export default Products;
