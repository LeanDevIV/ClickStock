import { useState, useEffect, useMemo } from "react";
import { useTableData } from "../../hooks/useTableData";
import { TABLE_CONFIG, THEME, SELECT_OPTIONS } from "../../config/adminConfig";
import { useCategoriesStore } from "../../hooks/useCategoriesStore";
import { Box, PaginationItem, Typography } from "@mui/material";
import { ProductosTable } from "../../components/admin/ProductosTable";

export const AdminDashboard = () => {
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

  const totalPages = Math.ceil(data.length / THEME.itemsPerPage);

  const renderTable = () => {
    if (loading) {
      return <p>Cargando datos...</p>;
    }
    if (error) {
      return <p>{error}</p>;
    }
    // const displayFields = TABLE_CONFIG[selectedSection].displayFields; // not used currently
    const commonProps = {
      data: paginatedData,
      editingId,
      editedData,
      onEdit: onEdit,
      onSave: handleSave,
      onCancel: handleCancel,
      onFieldChange: handleFieldChange,
    };
    switch (selectedSection) {
      case "Productos":
        return <ProductosTable {...commonProps} onRestore={handleRestore} onSoftDelete={handleSoftDelete} onHardDelete={handleHardDelete} onRefresh={fetchData} categorias={categorias} />;
      case "Usuarios":
        return <UsuariosTable {...commonProps} onRestore={handleRestore} />;
      case "Pedidos":
        return <PedidosTable {...commonProps} onRestore={handleRestore} />;
      case "Soporte":
        return <SoporteTable {...commonProps} />;
      case "Reseñas":
        return <ReseñasTable {...commonProps} onRestore={handleRestore} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* <AdminSidebar
        selectedSection={selectedSection}
        onSelectSection={setSelectedSection}
      /> */}

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Panel de administración - {selectedSection}
        </Typography>

        {renderTable()}

        {!loading && !error && totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <PaginationItem
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
              size="large"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
