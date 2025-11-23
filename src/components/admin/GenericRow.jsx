import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Chip from "@mui/material/Chip";
import {
  EditableCell,
  TableRowActions,
  DeletedChip,
  StatusChip,
} from "./TableComponents";
import { TABLE_CONFIG, CHIP_COLORS } from "../../config/adminConfig";

/**
 * Fila genérica reutilizable para todas las tablas
 */
export const GenericRow = ({
  item,
  section,
  tableHeader,
  editingId,
  editedData,
  onFieldChange,
  onEdit,
  onSave,
  onCancel,
  onRestore,
  onSoftDelete,
  onHardDelete,
  categorias = [],
}) => {
  const isEditing = editingId === (item._id || item.id);
  const itemId = item._id || item.id;
  const itemActual = isEditing ? { ...item, ...editedData } : item;
  const config = TABLE_CONFIG[section];

  // Función para obtener el nombre de la categoría por ID
  const getCategoriaNombre = (categoriaId) => {
    if (!categoriaId) return "N/A";
    const cat = categorias.find(
      (categoria) =>
        categoria._id === categoriaId || categoria.id === categoriaId
    );
    return cat?.nombre || categoriaId;
  };

  // Función para obtener la representación correcta del valor
  const renderCellValue = (field, value, displayValue) => {
    if (isEditing && config.editableFields.includes(field)) {
      return (
        <EditableCell
          value={value}
          field={field}
          isEditing={true}
          onChange={(newValue) => onFieldChange(field, newValue)}
          displayValue={displayValue}
        />
      );
    }

    // Si el campo tiene un displayValue (como categoría), mostrarlo
    if (displayValue !== undefined) {
      return displayValue;
    }

    // Campos especiales que necesitan formato
    switch (field) {
      case "precio":
        return `$${typeof value === "number" ? value.toFixed(2) : value}`;

      case "stock":
        return (
          <Chip
            label={value}
            size="small"
            color={value > 0 ? "success" : "error"}
          />
        );

      case "disponible":
        return (
          <Chip
            label={value ? "Sí" : "No"}
            size="small"
            color={value ? "success" : "default"}
          />
        );

      case "isDeleted":
        return <DeletedChip isDeleted={value} />;

      case "estado":
        return isEditing && config.editableFields.includes(field) ? (
          <EditableCell
            value={value}
            field={field}
            isEditing={true}
            onChange={(newValue) => onFieldChange(field, newValue)}
          />
        ) : (
          <StatusChip value={value} type="estado" />
        );

      case "rolUsuario":
        return isEditing && config.editableFields.includes(field) ? (
          <EditableCell
            value={value}
            field={field}
            isEditing={true}
            onChange={(newValue) => onFieldChange(field, newValue)}
          />
        ) : (
          <Chip
            label={value}
            size="small"
            color={CHIP_COLORS.rolUsuario?.[value] || "default"}
          />
        );

      case "deletedAt":
      case "createdAt":
      case "fecha":
      case "fechaCreacion":
      case "fechaInicio":
      case "fechaFin":
        if (!value) return "-";
        try {
          const date = new Date(value);
          if (isNaN(date.getTime())) return "-";
          return date.toLocaleDateString("es-AR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
        } catch (error) {
          console.error(`Error formatting date for field ${field}:`, error);
          return "-";
        }

      case "deletedBy":
        if (!value) return "-";
        return value.nombreUsuario || value.name || "Admin";

      case "usuario":
        if (!value) return "-";
        return typeof value === "object"
          ? value.nombreUsuario || value.name
          : value;

      case "productId":
        if (!value) return "-";
        return typeof value === "object" ? value.nombre || value.name : value;

      case "user":
        if (!value) return "-";
        return typeof value === "object"
          ? value.nombreUsuario || value.name
          : value;

      case "rating":
        return (
          <Chip
            label={`${value} ⭐`}
            size="small"
            color={value >= 4 ? "success" : "warning"}
          />
        );

      case "activa":
        return (
          <Chip
            label={value ? "Sí" : "No"}
            size="small"
            color={value ? "success" : "default"}
          />
        );

      default:
        return value || "-";
    }
  };

  return (
    <TableRow
      sx={{
        "&:hover": { bgcolor: "action.hover" },
        opacity: item.isDeleted ? 0.6 : 1,
      }}
    >
      {tableHeader.map((header) => {
        if (header.key === "actions") {
          return (
            <TableCell key={header.key} align="center">
              <TableRowActions
                isEditing={isEditing}
                onEdit={() => onEdit(item)}
                onSave={() => onSave(itemId)}
                onCancel={onCancel}
                onRestore={() => onRestore(itemId)}
                onSoftDelete={() => onSoftDelete(itemId)}
                onHardDelete={() => onHardDelete(itemId)}
                id={itemId}
                isDeleted={item.isDeleted}
              />
            </TableCell>
          );
        }

        let value = itemActual[header.key];
        let displayValue = undefined;

        // Manejo especial para categoría
        if (header.key === "categoria") {
          const categoriaId =
            itemActual.categoria?._id ||
            itemActual.categoria?.id ||
            itemActual.categoria;
          value = categoriaId;
          displayValue = getCategoriaNombre(categoriaId);
        }

        return (
          <TableCell
            key={header.key}
            sx={{
              textAlign: header.align || "left",
              padding: "12px 8px",
              fontSize: "0.875rem",
              color: "text.primary",
              wordBreak: "break-word",
            }}
          >
            {renderCellValue(header.key, value, displayValue)}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
