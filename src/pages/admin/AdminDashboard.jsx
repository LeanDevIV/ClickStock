import { useState, useEffect } from "react";
import { useTableData } from "../../hooks/useTableData";
import { TABLE_CONFIG, THEME } from "../../config/adminConfig";

export const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("Productos");

  const [page, setPage] = useState(1);

  const {
    data,
    editingId,
    editedData,
    loading,
    error,
    fetchData,
    handleEdit,
    handleSave,
    handleCancel,
    handleFieldChange,
    handleRestore,
  } = useTableData(selectedSection);

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
  console.log("datos de paginacion", paginatedData);

  const totalPages = Math.ceil(data.length / THEME.itemsPerPage);

  const renderTable = () => {
    if (loading) {
      return <p>Cargando datos...</p>;
    }
    if (error) {
      return <p>{error}</p>;
    }
    const displayFields = TABLE_CONFIG[selectedSection].displayFields;
    const commonProps = {
      data: paginatedData,
      editingId,
      editedData,
      onEdit: handleEdit,
      onSave: handleSave,
      onCancel: handleCancel,
      onFieldChange: handleFieldChange,
    };
      switch (selectedSection) {
      case 'Productos':
        return <ProductosTable {...commonProps} onRestore={handleRestore} />;
      case 'Usuarios':
        return <UsuariosTable {...commonProps} onRestore={handleRestore} />;
      case 'Pedidos':
        return <PedidosTable {...commonProps} onRestore={handleRestore} />;
      case 'Soporte':
        return <SoporteTable {...commonProps} />;
      case 'Reseñas':
        return <ReseñasTable {...commonProps} onRestore={handleRestore} />;
      default:
        return null;
    }
  };
  

  return (
    <div>
      <h1>Panel de Administración - {selectedSection}</h1>
      /*TODO
      {/* Aquí iría el componente de tabla que use los datos y funciones proporcionadas */}
    </div>
  );
};
