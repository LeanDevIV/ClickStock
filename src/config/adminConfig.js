export const MENU_ITEMS = [
    { titulo: 'Productos', seccion: 'Productos' },
  { titulo: 'Usuarios', seccion: 'Usuarios' },
  { titulo: 'Pedidos', seccion: 'Pedidos' },
  { titulo: 'Soporte', seccion: 'Soporte' },
  { titulo: 'Reseñas', seccion: 'Reseñas' },
];
export const TABLE_CONFIG = {
 Productos: {
    endpoint: '/productos',
    restauracionEndpoint: '/productos/:id/restaurar',
    actualizarEndpoint: '/productos/:id',
    camposEditables: ['nombre', 'descripcion', 'precio', 'categoria', 'stock', 'disponible'],
    camposVisuales: ['nombre', 'descripcion', 'precio', 'categoria', 'stock', 'disponible', 'isDeleted'],
  },
   Usuarios: {
    endpoint: '/usuarios',
    restauracionEndpoint: '/usuarios/:id/restaurar',
    actualizarEndpoint: '/usuarios/:id',
    camposEditables: ['nombreUsuario', 'rolUsuario'],
    camposVisuales: ['nombreUsuario', 'emailUsuario', 'rolUsuario', 'createdAt', 'isDeleted'],
  },
}