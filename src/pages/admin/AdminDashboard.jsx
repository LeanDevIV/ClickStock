import { useState, useEffect, useMemo } from "react";
import { useTableData } from "../../hooks/useTableData";
import { TABLE_CONFIG, THEME, SELECT_OPTIONS } from "../../config/adminConfig";
import { useCategoriesStore } from "../../hooks/useCategoriesStore";
import {
  Box,
  Pagination,
  Typography,
  Button,
  useTheme,
  Drawer,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { GenericTable } from "../../components/common/GenericTable";

import { usePageTitle } from "../../hooks/usePageTitle";

export const AdminDashboard = () => {
  usePageTitle("Admin - Dashboard");

  const theme = useTheme();
  const modoOscuro = theme.palette.mode === "dark";
  const [selectedSection, setSelectedSection] = useState("Productos");

  const [page, setPage] = useState(1);

  const { categorias, fetchCategorias } = useCategoriesStore();

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

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

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

    return (
      <GenericTable
        {...commonProps}
        onRestore={handleRestore}
        onSoftDelete={handleSoftDelete}
        onHardDelete={handleHardDelete}
      />
    );
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
    if (isMobile) {
      setMobileOpen(false);
    }
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
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "flex-start",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {isMobile ? (
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: 240,
                  bgcolor: "background.paper",
                  backgroundImage: "none",
                },
              }}
            >
              <AdminSidebar
                selectedSection={selectedSection}
                onSelectSection={handleSectionChange}
                isMobile={true}
              />
            </Drawer>
          ) : (
            <AdminSidebar
              selectedSection={selectedSection}
              onSelectSection={setSelectedSection}
              isMobile={false}
            />
          )}

          <Box sx={{ flex: 1, minWidth: 0, overflow: "auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                position: "relative",
                minHeight: "48px",
              }}
            >
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerToggle}
                  sx={{
                    position: "absolute",
                    left: 0,
                    border: `1px solid ${THEME.primaryColor}`,
                    borderRadius: 1,
                    color: THEME.primaryColor,
                    ml: 1,
                  }}
                >
                  <MenuOpenIcon />
                </IconButton>
              )}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {selectedSection}
              </Typography>
            </Box>
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
