import { useEffect } from "react";
import { clientAxios } from "../utils/clientAxios";

function Products() {
  useEffect(() => {
    obtenerProductos();
  }, []);
  async function obtenerProductos() {
    try {
      const productos = await clientAxios.get("/productos");
      console.log(productos.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  }
  return (
    <>
      <section>Página de productos</section>
      <ul>
        <li>
          {obtenerProductos().map((producto) => (
            <div key={producto.id}>{producto.nombre}</div>
          ))}
        </li>
      </ul>
      <section>Lista de productos se mostrará aquí.</section>

      <section>Componente de pie de página</section>
    </>
  );
}

export default Products;
