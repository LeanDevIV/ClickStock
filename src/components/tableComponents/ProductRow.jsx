import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Chip from "@mui/material/Chip";
import {
  EditableCell,
  TableRowActions,
  DeletedChip,
} from "../admin/TableComponents";
import { formatValue } from "../../utils/tableUtils";

// ESTE COMPONENTE YA NO MANEJA STATE, USA TODO DESDE EL HOOK
export const ProductRow = ({
  producto,
  editingId,
  editedData,
  onEdit,
  onSave,
  onCancel,
  onFieldChange,
  onRestore,
  onSoftDelete,
  onHardDelete,
  categorias = [],
}) => {
  const isEditing = editingId === producto._id;

  // Mezcla entre original y editado (lo que espera tu hook)
  const productoActual = isEditing ? { ...producto, ...editedData } : producto;

  // Función para obtener el nombre de la categoría por ID
  const getCategoriaNombre = (categoriaId) => {
    if (!categoriaId) return "N/A";
    const cat = categorias.find((categoria) => categoria._id === categoriaId || categoria.id === categoriaId);
    return cat?.nombre || categoriaId;
  };

  return (
    <TableRow
      sx={{
        "&:hover": { bgcolor: "action.hover" },
        opacity: producto.isDeleted ? 0.6 : 1,
      }}
    >
      {/* Nombre */}
      <TableCell>
        <EditableCell
          value={productoActual.nombre}
          field="nombre"
          isEditing={isEditing}
          onChange={(value) => onFieldChange("nombre", value)}
        />
      </TableCell>

      {/* Descripción */}
      <TableCell>
        <EditableCell
          value={productoActual.descripcion}
          field="descripcion"
          isEditing={isEditing}
          onChange={(value) => onFieldChange("descripcion", value)}
        />
      </TableCell>

      {/* Precio */}
      <TableCell>
        {isEditing ? (
          <EditableCell
            value={productoActual.precio}
            field="precio"
            isEditing={isEditing}
            onChange={(value) => onFieldChange("precio", value)}
          />
        ) : (
          formatValue(producto.precio, "price")
        )}
      </TableCell>

      {/* Categoría */}
      <TableCell>
        <EditableCell
          value={
            productoActual.categoria?._id ||
            productoActual.categoria?.id ||
            productoActual.categoria ||
            ""
          }
          displayValue={getCategoriaNombre(
            productoActual.categoria?._id ||
            productoActual.categoria?.id ||
            productoActual.categoria
          )}
          field="categoria"
          isEditing={isEditing}
          onChange={(value) => onFieldChange("categoria", value)}
        />
      </TableCell>

      {/* Stock */}
      <TableCell>
        {isEditing ? (
          <EditableCell
            value={productoActual.stock}
            field="stock"
            isEditing={isEditing}
            onChange={(value) => onFieldChange("stock", value)}
          />
        ) : (
          <Chip
            label={productoActual.stock}
            size="small"
            color={productoActual.stock > 0 ? "success" : "error"}
          />
        )}
      </TableCell>

      {/* Disponible */}
      <TableCell>
        {isEditing ? (
          <EditableCell
            value={productoActual.disponible}
            field="disponible"
            isEditing={isEditing}
            onChange={(value) => onFieldChange("disponible", value)}
          />
        ) : (
          <Chip
            label={productoActual.disponible ? "Sí" : "No"}
            size="small"
            color={productoActual.disponible ? "success" : "default"}
          />
        )}
      </TableCell>

      {/* Eliminado */}
      <TableCell>
        <DeletedChip isDeleted={productoActual.isDeleted} />
      </TableCell>

      {/* Eliminado por (Admin) */}
      <TableCell>
        {productoActual.deletedBy ? (
          <span title={productoActual.deletedBy.emailUsuario || ""}>
            {productoActual.deletedBy.nombreUsuario || "Admin desconocido"}
          </span>
        ) : (
          <span style={{ color: "#999" }}>-</span>
        )}
      </TableCell>

      {/* Fecha de eliminación */}
      <TableCell>
        {productoActual.deletedAt ? (
          <span>
            {new Date(productoActual.deletedAt).toLocaleDateString('es-AR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        ) : (
          <span style={{ color: "#999" }}>-</span>
        )}
      </TableCell>

      {/* Acciones */}
      <TableCell align="center">
        <TableRowActions
          isEditing={isEditing}
          // Adaptamos las llamadas para que el padre reciba lo que espera
          onEdit={() => onEdit(producto)}
          onSave={() => onSave(producto._id)}
          onCancel={onCancel}
          onRestore={() => onRestore(producto._id)}
          onSoftDelete={() => onSoftDelete(producto._id)}
          onHardDelete={() => onHardDelete(producto._id)}
          id={producto._id}
          isDeleted={producto.isDeleted}
        />
      </TableCell>
    </TableRow>
  );
};
