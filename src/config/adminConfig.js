export const MENU_ITEMS = [
  { titulo: "Productos", section: "Productos" },
  { titulo: "Usuarios", section: "Usuarios" },
  { titulo: "Pedidos", section: "Pedidos" },
  { titulo: "Soporte", section: "Soporte" },
  { titulo: "Reseñas", section: "Reseñas" },
];
export const TABLE_CONFIG = {
  Productos: {
    endpoint: "/productos",
    restoreEndpoint: "/productos/restore/:id",
    updateEndpoint: "/productos/:id",
    deleteEndpoint: "/productos/permanent/:id",
    softDeleteEndpoint: "/productos/soft/:id",
    editableFields: [
      "nombre",
      "descripcion",
      "precio",
      "categoria",
      "stock",
      "disponible",
    ],
    displayFields: [
      "nombre",
      "descripcion",
      "precio",
      "categoria",
      "stock",
      "disponible",
      "isDeleted",
      "deletedBy",
      "deletedAt",
    ],
  },
  Usuarios: {
    endpoint: "/usuarios",
    restoreEndpoint: "/usuarios/:id/restaurar",
    updateEndpoint: "/usuarios/:id",
    softDeleteEndpoint: "/usuarios/:id",
    editableFields: ["nombre", "rol"],
    displayFields: ["nombre", "correo", "rol", "createdAt", "isDeleted"],
  },
  Pedidos: {
    endpoint: "/pedidos",
    restoreEndpoint: "/pedidos/:id/restaurar",
    updateEndpoint: "/pedidos/:id",
    softDeleteEndpoint: "/pedidos/:id",
    editableFields: ["direccion", "estado"],
    displayFields: [
      "usuario",
      "direccion",
      "total",
      "estado",
      "fechaCreacion",
      "isDeleted",
    ],
  },
  Soporte: {
    endpoint: "/contacto",
    restoreEndpoint: null,
    updateEndpoint: "/contacto/:id",
    softDeleteEndpoint: null,
    editableFields: ["estado"],
    displayFields: ["nombre", "email", "asunto", "mensaje", "estado", "fecha"],
  },
  Reseñas: {
    endpoint: "/reviews",
    restoreEndpoint: "/reviews/:id/restaurar",
    updateEndpoint: "/reviews/:id",
    softDeleteEndpoint: "/reviews/:id",
    editableFields: ["rating", "comment"],
    displayFields: [
      "productId",
      "user",
      "rating",
      "comment",
      "createdAt",
      "isDeleted",
    ],
  },
};
export const FIELD_TYPES = {
  nombre: "text",
  descripcion: "multiline",
  correo: "text",
  email: "text",
  precio: "number",
  stock: "number",
  rating: { type: "number", min: 1, max: 5 },
  disponible: "select",
  rol: "select",
  estado: "select",
  comentario: "multiline",
  comment: "multiline",
  direccion: "text",
  asunto: "text",
  mensaje: "multiline",
  categoria: "select",
};
export const SELECT_OPTIONS = {
  disponible: [
    { value: true, label: "Sí" },
    { value: false, label: "No" },
  ],
  rol: [
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
  categoria: [],
};

export const CHIP_COLORS = {
  estado: {
    entregado: "success",
    cancelado: "error",
    enviado: "info",
    procesando: "warning",
    pendiente: "warning",
    leído: "info",
    respondido: "success",
  },
  rol: {
    admin: "error",
    usuario: "info",
  },
};
export const THEME = {
  primaryColor: "#D4AF37",
  darkColor: "#000",
  drawerWidth: 240,
  itemsPerPage: 5,
};
