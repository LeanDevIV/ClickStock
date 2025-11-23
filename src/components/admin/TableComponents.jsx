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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  DeleteForever as DeleteForeverIcon,
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
  onSoftDelete,
  onHardDelete,
}) => {
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [deleteType, setDeleteType] = React.useState(null); // 'soft' o 'hard'

  const showRestoreButton = isDeleted !== undefined;

  const handleDeleteClick = (type) => {
    setDeleteType(type);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (deleteType === "soft") {
      onSoftDelete?.(id);
    } else if (deleteType === "hard") {
      onHardDelete?.(id);
    }
    setOpenConfirm(false);
    setDeleteType(null);
  };

  const handleCancelDelete = () => {
    setOpenConfirm(false);
    setDeleteType(null);
  };

  return (
    <>
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
              <IconButton
                onClick={() => onSave(id)}
                color="success"
                size="small"
              >
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
          <>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => onEdit(id)}
                sx={{ color: THEME.primaryColor }}
                size="small"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            {/* Botón Soft Delete (solo si no está eliminado) */}
            {!isDeleted && (
              <Tooltip title="Eliminar (soft delete)">
                <IconButton
                  onClick={() => handleDeleteClick("soft")}
                  color="warning"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* Botón Hard Delete (solo si está eliminado) */}
            {isDeleted && (
              <Tooltip title="Eliminar permanentemente">
                <IconButton
                  onClick={() => handleDeleteClick("hard")}
                  color="error"
                  size="small"
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </Box>

      {/* Diálogo de confirmación */}
      <Dialog open={openConfirm} onClose={handleCancelDelete}>
        <DialogTitle>
          {deleteType === "soft"
            ? "Eliminar producto"
            : "Eliminar permanentemente"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteType === "soft"
              ? "¿Estás seguro de que deseas eliminar este producto? Podrás restaurarlo después."
              : "¿Estás seguro de que deseas eliminar permanentemente este producto? Esta acción no se puede deshacer."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color={deleteType === "hard" ? "error" : "warning"}
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
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
    const options = SELECT_OPTIONS[field] || [];
    return (
      <FormControl size="small" fullWidth>
        <Select value={value || ""} onChange={(e) => onChange(e.target.value)}>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  // --- DATE ---
  const isDate = fieldConfig === "date";
  if (isDate) {
    // Convertir el valor a formato YYYY-MM-DD para el input type="date"
    const dateValue = value ? new Date(value).toISOString().split("T")[0] : "";
    return (
      <TextField
        value={dateValue}
        onChange={(e) => onChange(e.target.value)}
        type="date"
        size="small"
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
      />
    );
  }

  // --- MULTILINE ---
  const isMultilineField = fieldConfig === "multiline";
  if (isMultilineField || isMultiline) {
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

export const StatusChip = ({ value, type = "estado", isEditing, onChange }) => {
  if (isEditing) {
    return (
      <FormControl size="small" fullWidth>
        <Select value={value} onChange={(e) => onChange(e.target.value)}>
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

/**
 * Componente reutilizable de controles para tablas administrativas
 * Incluye botón de refresh y toggle para mostrar eliminados
 */
export const TableControls = ({
  onRefresh,
  showDeletedLabel = "Mostrar eliminados",
  showDeletedInitial = true,
  onShowDeletedChange,
  isLoading = false,
}) => {
  const [showDeleted, setShowDeleted] = React.useState(showDeletedInitial);

  const handleToggleDeleted = (e) => {
    const newValue = e.target.checked;
    setShowDeleted(newValue);
    onShowDeletedChange?.(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        gap: 2,
      }}
    >
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={onRefresh}
        disabled={isLoading}
        sx={{
          bgcolor: THEME.primaryColor,
          color: THEME.darkColor,
          fontWeight: "bold",
          "&:hover": { bgcolor: "rgba(212, 175, 55, 0.85)" },
          "&:disabled": { opacity: 0.6 },
        }}
      >
        Actualizar
      </Button>

      <FormControlLabel
        control={
          <Switch
            checked={showDeleted}
            onChange={handleToggleDeleted}
            disabled={isLoading}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: THEME.primaryColor,
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: THEME.primaryColor,
              },
            }}
          />
        }
        label={showDeletedLabel}
      />
    </Box>
  );
};
