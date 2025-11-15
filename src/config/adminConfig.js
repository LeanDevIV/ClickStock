export const MENU_ITEMS = [
  { titulo: "Productos", section: "Productos" },
  { titulo: "Usuarios", section: "Usuarios" },
  { titulo: "Pedidos", section: "Pedidos" },
  { titulo: "Soporte", section: "Soporte" },
  { titulo: "Reseñas", section: "Reseñas" },
];export const TABLE_CONFIG = {
  Productos: {
    endpoint: '/productos',
    restoreEndpoint: '/productos/:id/restaurar',
    updateEndpoint: '/productos/:id',
    editableFields: ['nombre', 'descripcion', 'precio', 'categoria', 'stock', 'disponible'],
    displayFields: ['nombre', 'descripcion', 'precio', 'categoria', 'stock', 'disponible', 'isDeleted'],
  },
  Usuarios: {
    endpoint: '/usuarios',
    restoreEndpoint: '/usuarios/:id/restaurar',
    updateEndpoint: '/usuarios/:id',
    editableFields: ['nombreUsuario', 'rolUsuario'],
    displayFields: ['nombreUsuario', 'emailUsuario', 'rolUsuario', 'createdAt', 'isDeleted'],
  },
  Pedidos: {
    endpoint: '/pedidos',
    restoreEndpoint: '/pedidos/:id/restaurar',
    updateEndpoint: '/pedidos/:id',
    editableFields: ['direccion', 'estado'],
    displayFields: ['usuario', 'direccion', 'total', 'estado', 'fechaCreacion', 'isDeleted'],
  },
  Soporte: {
    endpoint: '/contactos',
    restoreEndpoint: null,
    updateEndpoint: '/contactos/:id',
    editableFields: ['estado'],
    displayFields: ['nombre', 'email', 'asunto', 'mensaje', 'estado', 'fecha'],
  },
  Reseñas: {
    endpoint: '/reviews',
    restoreEndpoint: '/reviews/:id/restaurar',
    updateEndpoint: '/reviews/:id',
    editableFields: ['rating', 'comment'],
    displayFields: ['productId', 'user', 'rating', 'comment', 'createdAt', 'isDeleted'],
  },
};
export const FIELD_TYPES = {
  nombre: "text",
  nombreUsuario: "text",
  descripcion: "multiline",
  emailUsuario: "text",
  email: "text",
  precio: "number",
  stock: "number",
  rating: { type: "number", min: 1, max: 5 },
  disponible: "select",
  rolUsuario: "select",
  estado: "select",
  comentario: "multiline",
  comment: "multiline",
  direccion: "text",
  asunto: "text",
  mensaje: "multiline",
};
export const SELECT_OPTIONS = {
  disponible: [
    { value: true, label: "Sí" },
    { value: false, label: "No" },
  ],
  rolUsuario: [
    { value: "usuario", label: "Usuario" },
    { value: "admin", label: "Admin" },
  ],
  estado: {
    Pedidos: [
      { value: "pendiente", label: "Pendiente" },
      { value: "procesando", label: "Procesando" },
      { value: "enviado", label: "Enviado" },
      { value: "entregado", label: "Entregado" },
      { value: "cancelado", label: "Cancelado" },
    ],
    Soporte: [
      { value: "pendiente", label: "Pendiente" },
      { value: "leído", label: "Leído" },
      { value: "respondido", label: "Respondido" },
    ],
  },
};

export const CHIP_COLORS = {
  estado: {
    entregado: 'success',
    cancelado: 'error',
    enviado: 'info',
    procesando: 'warning',
    pendiente: 'warning',
    leído: 'info',
    respondido: 'success',
  },
  rolUsuario: {
    admin: 'error',
    usuario: 'info',
  },
};
