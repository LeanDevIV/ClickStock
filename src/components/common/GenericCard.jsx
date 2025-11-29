import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Avatar,
  Chip,
  Collapse,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  TextField,
  useTheme,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  EditableCell,
  StatusChip,
  DeletedChip,
  TableRowActions,
  DeletedByCell,
} from "./TableComponents";
import { TABLE_CONFIG, CHIP_COLORS, THEME } from "../../config/adminConfig";
import { useStore } from "../../hooks/useStore";

export const GenericCard = ({
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
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
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

  const getCategoriaNombre = (categoriaOrId) => {
    if (!categoriaOrId) return "N/A";

    if (typeof categoriaOrId === "object") {
      return categoriaOrId.nombre || "N/A";
    }

    const cat = categorias.find(
      (categoria) =>
        categoria._id === categoriaOrId || categoria.id === categoriaOrId
    );
    return cat?.nombre || categoriaOrId;
  };

  const renderImageCell = (src, alt, field, isRounded = false) => {
    const canEdit = section !== "Usuarios";

    return (
      <Box
        sx={{
          position: "relative",
          width: 60,
          height: 60,
          mr: 2,
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
            border: `1px solid ${THEME.primaryColor}`,
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
      case "fotoPerfil":
        return renderImageCell(value, itemActual.nombre, "fotoPerfil", false);
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
        if (value <= 10) color = "error";
        else if (value <= 30) color = "warning";
        else if (value <= 50) {
          sx = {
            bgcolor: "#ffeb3b",
            color: "#000",
            "& .MuiChip-label": { fontWeight: "bold" },
          };
        } else color = "success";
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
        } catch {
          return "-";
        }
      case "deletedBy":
        return <DeletedByCell value={value} />;
      case "usuario":
      case "user":
        if (!value) return "-";
        return typeof value === "object"
          ? value.nombreUsuario || value.name
          : value;
      case "productId":
        if (!value)
          return (
            <Chip
              label="Producto Eliminado"
              size="small"
              color="error"
              variant="outlined"
            />
          );
        return typeof value === "object" ? value.nombre || value.name : value;
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
      default:
        if (Array.isArray(value))
          return value.length > 0 ? `${value.length} items` : "-";
        if (value && typeof value === "object") return JSON.stringify(value);
        return value || "-";
    }
  };

  const imageField = tableHeader.find(
    (h) => h.key === "imagen" || h.key === "fotoPerfil"
  );
  const titleField = tableHeader.find(
    (h) =>
      h.key === "nombre" ||
      h.key === "nombreUsuario" ||
      h.key === "titulo" ||
      h.key === "asunto"
  );
  const subtitleField = tableHeader.find(
    (h) =>
      h.key === "precio" ||
      h.key === "email" ||
      h.key === "rolUsuario" ||
      h.key === "categoria"
  );

  const otherFields = tableHeader.filter(
    (h) =>
      h.key !== "actions" &&
      h.key !== imageField?.key &&
      h.key !== titleField?.key &&
      h.key !== subtitleField?.key
  );

  return (
    <>
      <Card
        sx={{
          mb: 2,
          bgcolor: "background.paper",
          backgroundImage: "none",
          border: `1px solid ${
            item.isDeleted
              ? theme.palette.error.main
              : "rgba(212, 175, 55, 0.3)"
          }`,
          boxShadow: `0 0 10px ${
            item.isDeleted
              ? "rgba(211, 47, 47, 0.1)"
              : "rgba(212, 175, 55, 0.05)"
          }`,
          borderRadius: 2,
          overflow: "visible",
          opacity: item.isDeleted ? 0.8 : 1,
          position: "relative",
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
            {imageField && (
              <Box sx={{ flexShrink: 0 }}>
                {renderCellValue(
                  imageField.key,
                  itemActual[imageField.key],
                  undefined
                )}
              </Box>
            )}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              {titleField && (
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    lineHeight: 1.2,
                    mb: 0.5,
                    color: THEME.primaryColor,
                  }}
                >
                  {renderCellValue(
                    titleField.key,
                    itemActual[titleField.key],
                    undefined
                  )}
                </Typography>
              )}
              {subtitleField && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  {subtitleField.label}:{" "}
                  {renderCellValue(
                    subtitleField.key,
                    itemActual[subtitleField.key],
                    subtitleField.key === "categoria"
                      ? getCategoriaNombre(itemActual.categoria)
                      : undefined
                  )}
                </Typography>
              )}
            </Box>
          </Box>

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {otherFields.map((header) => {
                let value = itemActual[header.key];
                let displayValue = undefined;

                if (header.key === "categoria") {
                  displayValue = getCategoriaNombre(value);
                }

                return (
                  <Box
                    key={header.key}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      py: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: "bold" }}
                    >
                      {header.label}
                    </Typography>
                    <Box sx={{ textAlign: "right", maxWidth: "60%" }}>
                      {renderCellValue(header.key, value, displayValue)}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Collapse>
        </CardContent>

        <CardActions
          sx={{
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            p: 1,
            bgcolor: "rgba(0,0,0,0.2)",
          }}
        >
          <IconButton
            onClick={() => setExpanded(!expanded)}
            size="small"
            sx={{
              color: THEME.primaryColor,
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
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
        </CardActions>
      </Card>

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
