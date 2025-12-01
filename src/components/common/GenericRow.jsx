import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {
  EditableCell,
  StatusChip,
  DeletedChip,
  TableRowActions,
  DeletedByCell,
} from "./TableComponents";
import { TABLE_CONFIG, CHIP_COLORS, THEME } from "../../config/adminConfig";
import { useStore } from "../../hooks/useStore";

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
  onUpdateImage,
  categorias = [],
}) => {
  const isEditing = editingId === (item._id || item.id);
  const itemId = item._id || item.id;
  const itemActual = isEditing ? { ...item, ...editedData } : item;
  const config = TABLE_CONFIG[section];

  const currentUser = useStore((state) => state.user);
  const isCurrentUser =
    section === "Usuarios" &&
    currentUser &&
    (currentUser._id === item._id || currentUser.id === item._id);

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageTab, setImageTab] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [editingField, setEditingField] = useState(null);

  const handleImageClick = (field, currentUrl) => {
    setEditingField(field);
    setImageUrl(currentUrl || "");
    setImageFile(null);
    setImageTab(0);
    setImageDialogOpen(true);
  };

  const handleImageSave = async () => {
    if (!onUpdateImage) return;

    const value = imageTab === 0 ? imageFile : imageUrl;
    if (!value) return;

    const directory = section.toLowerCase();

    await onUpdateImage(item._id || item.id, editingField, value, directory);
    setImageDialogOpen(false);
  };

  const renderImageCell = (src, alt, field, isRounded = false) => {
    const canEdit = section !== "Usuarios";

    return (
      <Box
        sx={{
          position: "relative",
          width: isRounded ? 50 : 40,
          height: isRounded ? 50 : 40,
          "&:hover .edit-overlay": {
            opacity: canEdit ? 1 : 0,
          },
        }}
      >
        <Avatar
          src={src}
          alt={alt}
          variant={isRounded ? "rounded" : "circular"}
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: "rgba(212, 175, 55, 0.1)",
          }}
        >
          {alt?.charAt(0)}
        </Avatar>
        {canEdit && (
          <Box
            className="edit-overlay"
            onClick={(e) => {
              e.stopPropagation();
              handleImageClick(field, src);
            }}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.2s",
              cursor: "pointer",
              borderRadius: isRounded ? "4px" : "50%",
            }}
          >
            <EditIcon sx={{ color: "#fff", fontSize: "1.2rem" }} />
          </Box>
        )}
      </Box>
    );
  };

  const getCategoriaNombre = (categoriaId) => {
    if (!categoriaId) return "N/A";
    const cat = categorias.find(
      (categoria) =>
        categoria._id === categoriaId || categoria.id === categoriaId
    );
    return cat?.nombre || categoriaId;
  };

  const renderCellValue = (field, value, displayValue) => {
    if (isEditing && config.editableFields.includes(field)) {
      return (
        <EditableCell
          value={value}
          field={field}
          isEditing={true}
          onChange={(newValue) => onFieldChange(field, newValue)}
          displayValue={displayValue}
          section={section}
        />
      );
    }

    if (section === "Usuarios" && field === "nombre") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>{value}</span>
          {isCurrentUser && (
            <Chip
              label="Tú"
              size="small"
              sx={{
                backgroundColor: "#D4AF37",
                color: "#000",
                fontWeight: "bold",
                fontSize: "11px",
              }}
            />
          )}
        </div>
      );
    }

    if (displayValue !== undefined) {
      return displayValue;
    }

    switch (field) {
      case "fotoPerfil": {
        return renderImageCell(value, itemActual.nombre, "fotoPerfil", false);
      }

      case "imagen": {
        const imgSrc = itemActual.imagenes?.[0];
        return renderImageCell(imgSrc, itemActual.nombre, "imagenes", true);
      }

      case "precio":
        return typeof value === "number"
          ? new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value)
          : value;

      case "stock": {
        let color = "default";
        let sx = {};

        if (value <= 10) {
          color = "error";
        } else if (value <= 30) {
          color = "warning";
        } else if (value <= 50) {
          sx = {
            bgcolor: "#ffeb3b",
            color: "#000",
            "& .MuiChip-label": { fontWeight: "bold" },
          };
        } else if (value <= 100) {
          color = "success";
        } else {
          color = "success";
        }

        return <Chip label={value} size="small" color={color} sx={sx} />;
      }

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
        return <DeletedByCell value={value} />;

      case "usuario":
        if (!value)
          return (
            <Chip
              label="Usuario no disponible"
              size="small"
              color="default"
              variant="outlined"
              sx={{ fontStyle: "italic" }}
            />
          );
        return typeof value === "object"
          ? value.nombre || value.nombreUsuario || value.name
          : value;

      case "productId":
        if (!value) {
          return (
            <Chip
              label="Producto Eliminado"
              size="small"
              color="error"
              variant="outlined"
            />
          );
        }
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
      case "destacado":
        return (
          <Chip
            label={value ? "Sí" : "No"}
            size="small"
            color={value ? "success" : "default"}
          />
        );
      case "productos":
        if (!value || !Array.isArray(value) || value.length === 0) {
          return (
            <Typography variant="caption" color="text.secondary">
              Sin productos
            </Typography>
          );
        }
        return (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {value.map((p, i) => (
              <Chip
                key={i}
                size="small"
                label={
                  p.producto && typeof p.producto === "object"
                    ? `${p.producto.nombre} (x${p.cantidad})`
                    : `Producto no disponible (x${p.cantidad})`
                }
                variant="outlined"
              />
            ))}
          </Box>
        );

      default:
        if (Array.isArray(value)) {
          return value.length > 0 ? `${value.length} items` : "-";
        }
        if (value && typeof value === "object") {
          return JSON.stringify(value);
        }
        return value || "-";
    }
  };

  return (
    <>
      <TableRow
        sx={{
          bgcolor: "transparent",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "rgba(212, 175, 55, 0.05)",
            cursor: "pointer",
          },
          "& td": {
            borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
          },
          opacity: item.isDeleted ? 0.6 : 1,
        }}
      >
        {tableHeader.map((header) => {
          if (header.key === "actions") {
            return (
              <TableCell
                key={header.key}
                align="center"
                sx={{ verticalAlign: "middle" }}
              >
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
                  isCurrentUser={isCurrentUser}
                />
              </TableCell>
            );
          }

          let value = itemActual[header.key];
          let displayValue = undefined;

          if (header.key === "categoria") {
            const rawCategoria = itemActual.categoria;
            let categoriaId = rawCategoria;

            if (rawCategoria && typeof rawCategoria === "object") {
              categoriaId = rawCategoria._id || rawCategoria.id;
            }

            value = categoriaId;
            displayValue = getCategoriaNombre(categoriaId);
          }

          return (
            <TableCell
              key={header.key}
              sx={{
                textAlign: header.align || "left",
                padding: "16px",
                fontSize: "0.875rem",
                color: "text.primary",
                wordBreak: "break-word",
                verticalAlign: "middle",
                whiteSpace: header.key === "precio" ? "nowrap" : "normal",
              }}
            >
              {renderCellValue(header.key, value, displayValue)}
            </TableCell>
          );
        })}
      </TableRow>

      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#1e1e1e",
            color: "#fff",
            border: `1px solid ${THEME.primaryColor}`,
          },
        }}
      >
        <DialogTitle sx={{ color: THEME.primaryColor }}>
          Actualizar Imagen
        </DialogTitle>
        <DialogContent>
          <Tabs
            value={imageTab}
            onChange={(e, v) => setImageTab(v)}
            sx={{
              mb: 2,
              "& .MuiTab-root": { color: "#888" },
              "& .Mui-selected": { color: THEME.primaryColor },
              "& .MuiTabs-indicator": { bgcolor: THEME.primaryColor },
            }}
          >
            <Tab label="Subir Archivo" />
            <Tab label="URL" />
          </Tabs>

          {imageTab === 0 ? (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  color: THEME.primaryColor,
                  borderColor: THEME.primaryColor,
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(212, 175, 55, 0.1)",
                  },
                }}
              >
                Seleccionar Archivo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </Button>
              {imageFile && (
                <Typography sx={{ mt: 1, fontSize: "0.9rem" }}>
                  Archivo seleccionado: {imageFile.name}
                </Typography>
              )}
            </Box>
          ) : (
            <TextField
              fullWidth
              label="URL de la imagen"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              sx={{
                mt: 2,
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
                  "&:hover fieldset": { borderColor: "#fff" },
                  "&.Mui-focused fieldset": { borderColor: THEME.primaryColor },
                },
                "& .MuiInputLabel-root": { color: "#888" },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: THEME.primaryColor,
                },
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setImageDialogOpen(false)}
            sx={{ color: "#888" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleImageSave}
            sx={{ color: THEME.primaryColor }}
            disabled={imageTab === 0 ? !imageFile : !imageUrl}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
