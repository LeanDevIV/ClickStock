export const MENU_ITEMS = [
  { titulo: "Productos", section: "Productos" },
  { titulo: "Usuarios", section: "Usuarios" },
  { titulo: "Pedidos", section: "Pedidos" },
  { titulo: "Soporte", section: "Soporte" },
  { titulo: "Reseñas", section: "Reseñas" },
  { titulo: "Promociones", section: "Promociones" },
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
      "destacado",
      "imagenes",
    ],
    displayFields: [
      "imagen",
      "nombre",
      "descripcion",
      "precio",
      "categoria",
      "stock",
      "disponible",
      "destacado",
      "isDeleted",
      "deletedBy",
      "deletedAt",
    ],
  },
  Usuarios: {
    endpoint: "/usuarios",
    restoreEndpoint: "/usuarios/restore/:id",
    updateEndpoint: "/usuarios/:id",
    deleteEndpoint: "/usuarios/permanent/:id",
    softDeleteEndpoint: "/usuarios/:id",
    editableFields: ["nombre", "rol"],
    displayFields: [
      "fotoPerfil",
      "nombre",
      "correo",
      "rol",
      "createdAt",
      "isDeleted",
    ],
  },
  Pedidos: {
    endpoint: "/pedidos",
    restoreEndpoint: "/pedidos/restore/:id",
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
    deleteEndpoint: "/contacto/:id",
    softDeleteEndpoint: null,
    editableFields: ["estado"],
    displayFields: ["nombre", "email", "asunto", "mensaje", "estado", "fecha"],
  },
  Reseñas: {
    endpoint: "/reviews",
    restoreEndpoint: "/reviews/restore/:id",
    softDeleteEndpoint: "/reviews/:id",
    deleteEndpoint: "/reviews/permanent/:id",
    editableFields: [],
    displayFields: [
      "productId",
      "user",
      "rating",
      "comment",
      "createdAt",
      "isDeleted",
    ],
  },
  Promociones: {
    endpoint: "/promociones",
    restoreEndpoint: "/promociones/restore/:id",
    updateEndpoint: "/promociones/:id",
    deleteEndpoint: "/promociones/permanent/:id",
    softDeleteEndpoint: "/promociones/soft/:id",
    editableFields: [
      "titulo",
      "descripcion",
      "descuento",
      "fechaInicio",
      "fechaFin",
      "activa",
    ],
    displayFields: [
      "titulo",
      "descuento",
      "fechaInicio",
      "fechaFin",
      "activa",
      "createdAt",
      "isDeleted",
      "deletedBy",
      "deletedAt",
    ],
    validate: (data) => {
      if (data.fechaInicio && data.fechaFin) {
        const inicio = new Date(data.fechaInicio);
        const fin = new Date(data.fechaFin);
        if (fin < inicio) {
          return "La fecha de fin no puede ser anterior a la fecha de inicio";
        }
      }
      return null;
    },
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
  disponible: "boolean",
  destacado: "boolean",
  rol: "select",
  estado: "select",
  comentario: "multiline",
  comment: "multiline",
  direccion: "text",
  asunto: "text",
  mensaje: "multiline",
  categoria: "select",
  titulo: "text",
  descuento: "number",
  fechaInicio: "date",
  fechaFin: "date",
  activa: "select",
  imagenes: "file",
};
export const SELECT_OPTIONS = {
  disponible: [
    { value: true, label: "Sí" },
    { value: false, label: "No" },
  ],
  destacado: [
    { value: true, label: "Sí" },
    { value: false, label: "No" },
  ],
  activa: [
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
      { value: "respondido", label: "Respondido" },
      { value: "descartado", label: "Descartado" },
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
    descartado: "error",
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
  itemsPerPage: 10,
};
