import { useState } from "react";
import { THEME, TABLE_CONFIG } from "../../config/adminConfig";
import { Box } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { TableControls } from "./TableComponents";
import { GenericRow } from "./GenericRow";
import { CreateItemModal } from "../admin/CreateItemModal";

/**
 * Tabla genérica reutilizable para todas las secciones del admin
 */
export const GenericTable = ({
  section,
  data,
  editingId,
  editedData,
  onEdit,
  onSave,
  onCancel,
  onFieldChange,
  onRestore,
  onSoftDelete,
  onHardDelete,
  onRefresh,
  onCreate,
  categorias = [],
  onUpdateImage,
}) => {
  const [showDeleted, setShowDeleted] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const config = TABLE_CONFIG[section];

  const shouldShowDeleted = config.softDeleteEndpoint !== undefined;

  const filteredData = showDeleted
    ? data
    : data?.filter((item) => !item.isDeleted) || [];

  const tableHeader = config.displayFields.map((field) => {
    const labels = {
      fotoPerfil: "Foto",
      imagen: "Imagen",
      nombre: "Nombre",
      nombreUsuario: "Usuario",
      descripcion: "Descripción",
      emailUsuario: "Email",
      email: "Email",
      correo: "Correo",
      precio: "Precio",
      categoria: "Categoría",
      stock: "Stock",
      disponible: "Disponible",
      direccion: "Dirección",
      total: "Total",
      estado: "Estado",
      fechaCreacion: "Fecha",
      createdAt: "Creada",
      usuario: "Usuario",
      rolUsuario: "Rol",
      rol: "Rol",
      isDeleted: "Eliminado",
      deletedBy: "Eliminado por",
      deletedAt: "Fecha de eliminación",
      asunto: "Asunto",
      mensaje: "Mensaje",
      fecha: "Fecha",
      productId: "Producto",
      user: "Usuario",
      rating: "Calificación",
      comment: "Comentario",

      titulo: "Título",
      descuento: "Descuento",
      fechaInicio: "Fecha Inicio",
      fechaFin: "Fecha Fin",
      activa: "Activa",
      destacado: "Destacado",
    };

    return {
      key: field,
      label: labels[field] || field,
      align: field === "actions" ? "center" : "left",
    };
  });

  if (!tableHeader.find((h) => h.key === "actions")) {
    tableHeader.push({ key: "actions", label: "Acciones", align: "center" });
  }

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          backgroundColor: "transparent",
          backgroundImage: "none",
          boxShadow: "none",
        }}
      >
        <Table
          sx={{
            minWidth: { xs: 320, sm: 500 },
          }}
        >
          <TableHead>
            <TableRow>
              {tableHeader.map((cell) => (
                <TableCell
                  key={cell.key}
                  sx={{
                    color: THEME.primaryColor,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    borderBottom: `1px solid ${THEME.primaryColor}`,
                    textAlign: cell.align || "left",
                    minWidth: cell.key === "actions" ? "100px" : "80px",
                    padding: { xs: "8px 4px", sm: "16px" },
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  }}
                >
                  {cell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((item) => (
                <GenericRow
                  key={item._id || item.id}
                  item={item}
                  section={section}
                  tableHeader={tableHeader}
                  editingId={editingId}
                  editedData={editedData}
                  onFieldChange={onFieldChange}
                  onEdit={onEdit}
                  onSave={onSave}
                  onCancel={onCancel}
                  onRestore={onRestore}
                  onSoftDelete={onSoftDelete}
                  onHardDelete={onHardDelete}
                  categorias={categorias}
                  onUpdateImage={onUpdateImage}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableHeader.length}
                  align="center"
                  sx={{ py: 3 }}
                >
                  <span
                    style={{ color: THEME.primaryColor, fontStyle: "italic" }}
                  >
                    {showDeleted
                      ? "No hay registros disponibles"
                      : "No hay registros activos"}
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2 }}>
        <TableControls
          onRefresh={onRefresh}
          showDeletedLabel="Mostrar eliminados"
          showDeletedInitial={true}
          onShowDeletedChange={setShowDeleted}
          onAdd={
            [
              "Promociones",
              "Reseñas",
              "Soporte",
              "Pedidos",
              "Usuarios",
            ].includes(section)
              ? undefined
              : () => setShowCreateModal(true)
          }
          showDeletedSwitch={shouldShowDeleted}
        />
      </Box>

      <CreateItemModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={onCreate}
        section={section}
        config={config}
      />
    </Box>
  );
};
