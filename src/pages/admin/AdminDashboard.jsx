import { useState, useEffect, useMemo } from "react";
import { useTableData } from "../../hooks/useTableData";
import { TABLE_CONFIG, THEME, SELECT_OPTIONS } from "../../config/adminConfig";
import { useCategoriesStore } from "../../hooks/useCategoriesStore";
import { Box, Pagination, Typography, Button, useTheme } from "@mui/material";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { GenericTable } from "../../components/common/GenericTable";

export const AdminDashboard = () => {
  const theme = useTheme();
  const modoOscuro = theme.palette.mode === "dark";
  const [selectedSection, setSelectedSection] = useState("Productos");

  const [page, setPage] = useState(1);

  // Hook para obtener categorías
  const { categorias, fetchCategorias } = useCategoriesStore();
  // Opciones estables para evitar recrear el objeto en cada render (previene loops de fetch)
  const adminOptions = useMemo(
    () => ({ includeDeleted: true, includeUnavailable: true }),
    []
  );

  const {
    data,
    editingId,
    editedData,
    loading,
    error,
    fetchData,
    onEdit,
    handleSave,
    handleCancel,
    handleFieldChange,
    handleRestore,
    handleSoftDelete,
    handleHardDelete,
    handleCreate,
    handleUpdateImage,
  } = useTableData(selectedSection, adminOptions);

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  // Actualizar SELECT_OPTIONS.categoria cuando se carguen las categorías
  useEffect(() => {
    if (categorias.length > 0) {
      SELECT_OPTIONS.categoria = categorias.map((cat) => ({
        value: cat._id || cat.id,
        label: cat.nombre,
      }));
    }
  }, [categorias]);

  useEffect(() => {
    fetchData();
    setPage(1);
  }, [selectedSection, fetchData]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const paginatedData = Array.isArray(data)
    ? data.slice((page - 1) * THEME.itemsPerPage, page * THEME.itemsPerPage)
    : [];

  const totalPages = Math.ceil((data?.length || 0) / THEME.itemsPerPage);

  const renderTable = () => {
    if (loading) {
      return <p>Cargando datos...</p>;
    }
    if (error) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button variant="contained" onClick={fetchData} sx={{ mt: 1 }}>
            Reintentar
          </Button>
        </Box>
      );
    }

    const commonProps = {
      section: selectedSection,
      data: paginatedData,
      editingId,
      editedData,
      onEdit:
        TABLE_CONFIG[selectedSection].editableFields &&
        TABLE_CONFIG[selectedSection].editableFields.length > 0
          ? onEdit
          : undefined,
      onSave: handleSave,
      onCancel: handleCancel,
      onFieldChange: handleFieldChange,
      onRefresh: fetchData,
      categorias: categorias,
      onCreate: handleCreate,
      onUpdateImage: handleUpdateImage,
    };

    // Usar GenericTable para todas las secciones
    return (
      <GenericTable
        {...commonProps}
        onRestore={handleRestore}
        onSoftDelete={handleSoftDelete}
        onHardDelete={handleHardDelete}
      />
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        bgcolor: modoOscuro ? "rgba(0,0,0,0.4)" : "background.default",
        backdropFilter: modoOscuro ? "blur(4px)" : "none",
      }}
    >
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 2, width: "100%", overflow: "hidden" }}
      >
        {/* Contenedor Sidebar + Tabla en flex */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "flex-start",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {/* Sidebar */}
          <AdminSidebar
            selectedSection={selectedSection}
            onSelectSection={setSelectedSection}
          />

          {/* Main Content (Tabla) */}
          <Box sx={{ flex: 1, minWidth: 0, overflow: "auto" }}>
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontWeight: "bold",
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
            >
              {selectedSection}
            </Typography>
            {renderTable()}

            {!loading && !error && totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "text.primary",
                    },
                    "& .Mui-selected": {
                      bgcolor: `${THEME.primaryColor} !important`,
                      color: THEME.darkColor,
                      fontWeight: "bold",
                    },
                    "& .MuiPaginationItem-root:hover": {
                      bgcolor: "rgba(212, 175, 55, 0.15)",
                    },
                  }}
                  size="small"
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
