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
  FormControlLabel,
  Switch,
  Button,
  Checkbox,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  DeleteForever as DeleteForeverIcon,
  AddCircle as AddCircleIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
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
  isCurrentUser,
}) => {
  const showRestoreButton = isDeleted !== undefined;

  const handleDeleteClick = async (type) => {
    const result = await Swal.fire({
      title:
        type === "soft" ? "¿Eliminar elemento?" : "¿Eliminar permanentemente?",
      text:
        type === "soft"
          ? "Podrás restaurarlo después"
          : "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: type === "soft" ? "#ff9800" : "#d32f2f",
      cancelButtonColor: "#6c757d",
      confirmButtonText:
        type === "soft" ? "Sí, eliminar" : "Sí, eliminar permanentemente",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      if (type === "soft") {
        onSoftDelete?.(id);
      } else if (type === "hard") {
        onHardDelete?.(id);
      }
    }
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
            <Tooltip
              title={
                isCurrentUser ? "No puedes editar tu propio usuario" : "Editar"
              }
            >
              <span>
                <IconButton
                  onClick={() => onEdit(id)}
                  sx={{ color: THEME.primaryColor }}
                  size="small"
                  disabled={isCurrentUser}
                >
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>

            {!isDeleted && (
              <Tooltip
                title={
                  isCurrentUser
                    ? "No puedes eliminar tu propio usuario"
                    : "Eliminar (soft delete)"
                }
              >
                <IconButton
                  onClick={() => handleDeleteClick("soft")}
                  color="warning"
                  size="small"
                  disabled={isCurrentUser}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}

            {isDeleted && (
              <Tooltip title="Eliminar permanentemente">
                <IconButton
                  onClick={() => handleDeleteClick("hard")}
                  color="error"
                  size="small"
                  disabled={isCurrentUser}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </Box>
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
  section,
}) => {
  if (!isEditing) {
    return displayValue !== undefined ? displayValue : value;
  }

  const fieldConfig = FIELD_TYPES[field];
  const isNumeric =
    fieldConfig === "number" ||
    (typeof fieldConfig === "object" && fieldConfig.type === "number");

  const isSelect =
    fieldConfig === "select" ||
    (typeof fieldConfig === "object" && fieldConfig.type === "select");

  if (isSelect) {
    let options = SELECT_OPTIONS[field] || [];

    if (!Array.isArray(options) && section && options[section]) {
      options = options[section];
    } else if (!Array.isArray(options)) {
      options = [];
    }

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

  const isDate = fieldConfig === "date";
  if (isDate) {
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

  const isBoolean = fieldConfig === "boolean";
  if (isBoolean) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Checkbox
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          sx={{
            color: THEME.primaryColor,
            "&.Mui-checked": {
              color: THEME.primaryColor,
            },
          }}
        />
      </Box>
    );
  }

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

export const DeletedByCell = ({ value }) => {
  const [showUid, setShowUid] = React.useState(false);

  if (!value) return "-";

  if (typeof value === "string") return value;

  const name =
    value.nombre && value.apellido
      ? `${value.nombre} ${value.apellido}`
      : value.nombre || value.nombreUsuario || value.name || "Admin";
  const email = value.correo || value.emailUsuario || value.email;
  const uid = value._id || value.id;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
        {name}{" "}
        {email && (
          <span style={{ opacity: 0.7, fontSize: "0.8rem" }}>({email})</span>
        )}
      </Typography>
      {uid && (
        <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => setShowUid(!showUid)}
            sx={{
              padding: 0,
              mr: 1,
              color: THEME.primaryColor,
              "&:hover": { backgroundColor: "rgba(212, 175, 55, 0.1)" },
            }}
            title={showUid ? "Ocultar ID" : "Ver ID"}
          >
            {showUid ? (
              <VisibilityOffIcon sx={{ fontSize: 16 }} />
            ) : (
              <VisibilityIcon sx={{ fontSize: 16 }} />
            )}
          </IconButton>
          {showUid && (
            <Typography
              variant="caption"
              sx={{
                fontFamily: "monospace",
                fontSize: "0.75rem",
                opacity: 0.8,
              }}
            >
              {uid}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export const TableControls = ({
  onRefresh,
  showDeletedLabel = "Mostrar eliminados",
  showDeletedInitial = true,
  onShowDeletedChange,
  isLoading = false,
  onAdd,
  showDeletedSwitch = true,
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

      {onAdd && (
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={onAdd}
          sx={{
            bgcolor: "success.main",
            color: "white",
            fontWeight: "bold",
            "&:hover": { bgcolor: "success.dark" },
          }}
        >
          Agregar
        </Button>
      )}

      {showDeletedSwitch && (
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
      )}
    </Box>
  );
};
