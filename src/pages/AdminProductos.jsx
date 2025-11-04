import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clientAxios from '../utils/clientAxios';
import Swal from 'sweetalert2';

const AdminProductos = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        obtenerProductos();
    }, []);

    const obtenerProductos = async () => {
        try {
            const { data } = await clientAxios.get('/productos');
            setProductos(data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    const eliminarProducto = async (id) => {
        try {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Esta acción no se puede revertir",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await clientAxios.delete(`/productos/${id}`);
                    obtenerProductos();
                    Swal.fire(
                        '¡Eliminado!',
                        'El producto ha sido eliminado.',
                        'success'
                    );
                }
            });
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Administración de Productos</h1>
                <Link
                    to="/nuevo-producto"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Agregar Nuevo Producto
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border-b border-gray-300 bg-gray-100">Nombre</th>
                            <th className="px-6 py-3 border-b border-gray-300 bg-gray-100">Precio</th>
                            <th className="px-6 py-3 border-b border-gray-300 bg-gray-100">Stock</th>
                            <th className="px-6 py-3 border-b border-gray-300 bg-gray-100">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((producto) => (
                            <tr key={producto._id}>
                                <td className="px-6 py-4 border-b border-gray-300">{producto.nombre}</td>
                                <td className="px-6 py-4 border-b border-gray-300">${producto.precio}</td>
                                <td className="px-6 py-4 border-b border-gray-300">{producto.stock}</td>
                                <td className="px-6 py-4 border-b border-gray-300">
                                    <Link
                                        to={`/editar-producto/${producto._id}`}
                                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded mr-2"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => eliminarProducto(producto._id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductos;