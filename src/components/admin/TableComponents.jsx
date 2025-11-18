import React from "react";
import {
  Box,
  IconButton,
  Tooltip,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  FIELD_TYPES,
  SELECT_OPTIONS,
  CHIP_COLORS,
  THEME,
} from "../../config/adminConfig";

export const TableRowActions = ({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  id,
  isDeleted,
  onRestore,
}) => {
  const showRestoreButton = isDeleted !== undefined;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {showRestoreButton && (
        <Tooltip title={isDeleted ? "Restaurar" : "Elemento activo"}>
          <span>
            <IconButton
              onClick={() => onRestore?.(id)}
              disabled={!isDeleted}
              sx={{ color: THEME.primaryColor }}
              size="small"
            >
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
      )}

      {isEditing ? (
        <>
          <Tooltip title="Guardar cambios">
            <IconButton onClick={() => onSave(id)} color="success" size="small">
              <CheckIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancelar edición">
            <IconButton onClick={onCancel} color="error" size="small">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title="Editar">
          <IconButton
            onClick={() => onEdit(id)}
            sx={{ color: THEME.primaryColor }}
            size="small"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export const EditableCell = ({
  value,
  field,
  isEditing,
  onChange,
  isMultiline = false,
  displayValue,
}) => {
  if (!isEditing) {
    // Si hay un displayValue (ej: nombre de categoría), mostrarlo; si no, usar value
    return displayValue !== undefined ? displayValue : value;
  }

  const fieldConfig = FIELD_TYPES[field];
  const isNumeric =
    fieldConfig === "number" ||
    (typeof fieldConfig === "object" && fieldConfig.type === "number");

  // --- SELECT ---
  const isSelect =
    fieldConfig === "select" ||
    (typeof fieldConfig === "object" && fieldConfig.type === "select");

  if (isSelect) {
    return (
      <FormControl size="small" fullWidth>
        <Select value={value} onChange={(e) => onChange(e.target.value)}>
          {SELECT_OPTIONS[field]?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  // --- MULTILINE ---
  if (fieldConfig === "multiline" || isMultiline) {
    return (
      <TextField
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        fullWidth
        multiline
        rows={2}
      />
    );
  }

  // --- TEXT / NUMBER ---
  return (
    <TextField
      value={value || ""}
      onChange={(e) =>
        onChange(isNumeric ? parseFloat(e.target.value) : e.target.value)
      }
      type={isNumeric ? "number" : "text"}
      size="small"
      fullWidth
      {...(typeof fieldConfig === "object" &&
        fieldConfig.min && {
          inputProps: { min: fieldConfig.min, max: fieldConfig.max },
        })}
    />
  );
};

export const StatusChip = ({
  value,
  type = "estado",
  isEditing,
  onChange,
  
}) => {
  if (isEditing) {
    return (
      <FormControl size="small" fullWidth>
        <Select value={value} onChange={(e) => onChange( e.target.value)}>
          {SELECT_OPTIONS[type]?.[
            type === "Pedidos"
              ? "Pedidos"
              : type === "Soporte"
              ? "Soporte"
              : "Pedidos"
          ]?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  const color = CHIP_COLORS[type]?.[value] || "default";
  return <Chip label={value} size="small" color={color} />;
};

export const DeletedChip = ({ isDeleted }) => (
  <Chip
    label={isDeleted ? "Sí" : "No"}
    size="small"
    color={isDeleted ? "error" : "success"}
  />
);
