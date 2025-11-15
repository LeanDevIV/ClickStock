import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Chip from "@mui/material/Chip";
import { EditableCell, TableRowActions, DeletedChip } from "../admin/TableComponents";
import { formatValue } from "../../utils/tableUtils";

export const ProductRow = ({
  producto,
  editingId,
  editedData,
  onFieldChange,
  onEdit,
  onSave,
  onCancel,
  onRestore,
}) => {

  const isEditing = editingId === producto._id;
  const productoActual = isEditing ? editedData : producto;

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
          onChange={(value) =>
            onFieldChange(producto._id, "nombre", value)
          }
          isEditing={isEditing}
        />
      </TableCell>

      {/* Descripción */}
      <TableCell>
        <EditableCell
          value={productoActual.descripcion}
          field="descripcion"
          onChange={(value) =>
            onFieldChange(producto._id, "descripcion", value)
          }
          isEditing={isEditing}
        />
      </TableCell>

      {/* Precio */}
      <TableCell>
        {isEditing ? (
          <EditableCell
            value={productoActual.precio}
            field="precio"
            onChange={(value) =>
              onFieldChange(producto._id, "precio", value)
            }
            isEditing={isEditing}
          />
        ) : (
          formatValue(producto.precio, "price")
        )}
      </TableCell>

      {/* Categoría */}
      <TableCell>
        {isEditing ? (
          <EditableCell
            value={
              productoActual.categoria?.nombre ||
              productoActual.categoria ||
              ""
            }
            field="categoria"
            isEditing={isEditing}
            onChange={(value) =>
              onFieldChange(producto._id, "categoria", value)
            }
          />
        ) : (
          producto.categoria?.nombre || producto.categoria || "N/A"
        )}
      </TableCell>

      {/* Stock */}
      <TableCell>
        {isEditing ? (
          <EditableCell
            value={productoActual.stock}
            field="stock"
            isEditing={isEditing}
            onChange={(value) =>
              onFieldChange(producto._id, "stock", value)
            }
          />
        ) : (
          <Chip
            label={productoActual.stock}
            size="small"
            color={productoActual.stock > 0 ? "success" : "error"}
          />
        )}
      </TableCell>

      {/* Eliminado */}
      <TableCell>
        <DeletedChip isDeleted={productoActual.isDeleted} />
      </TableCell>

      {/* Acciones */}
      <TableCell align="center">
        <TableRowActions
          isEditing={isEditing}
          onEdit={() => onEdit(producto)}
          onSave={onSave}
          onCancel={onCancel}
          id={producto._id}
          isDeleted={producto.isDeleted}
          onRestore={onRestore}
        />
      </TableCell>
    </TableRow>
  );
};
