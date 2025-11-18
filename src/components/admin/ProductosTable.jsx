import React, { useState } from "react";
import { THEME } from "../../config/adminConfig";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

import { ProductRow } from "../tableComponents/ProductRow";
import { TableControls } from "./TableComponents";

export const ProductosTable = ({
  data,
  editingId,
  editedData,
  onEdit,
  onSave,
  onCancel,
  onFieldChange,
  onRestore,
  onSoftDelete,
  onHardDelete,
  categorias = [],
  onRefresh,
}) => {
  const [showDeleted, setShowDeleted] = useState(true);

  // Filtrar datos según showDeleted
  const filteredData = showDeleted
    ? data
    : data?.filter((producto) => !producto.isDeleted) || [];

  const tableHeader = [
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
    { key: "precio", label: "Precio" },
    { key: "categoria", label: "Categoría" },
    { key: "stock", label: "Stock" },
    { key: "disponible", label: "Disponible" },
    { key: "isDeleted", label: "Eliminado" },
    { key: "deletedBy", label: "Eliminado por" },
    { key: "deletedAt", label: "Fecha de eliminación" },
    { key: "actions", label: "Acciones", align: "center" },
  ];

  return (
    <>
      <TableControls
        onRefresh={onRefresh}
        showDeletedLabel="Mostrar eliminados"
        showDeletedInitial={true}
        onShowDeletedChange={setShowDeleted}
      />

      {/* Tabla */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: THEME.primaryColor }}>
              {tableHeader.map((cell) => (
                <TableCell
                  key={cell.key}
                  sx={{
                    color: THEME.darkColor,
                    fontWeight: "bold",
                    textAlign: cell.align || "left",
                  }}
                >
                  {cell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((producto) => (
                <ProductRow
                  key={producto._id}
                  producto={producto}
                  editingId={editingId}
                  editedData={editedData}
                  onFieldChange={onFieldChange}
                  onEdit={onEdit}
                  onSave={onSave}
                  onCancel={onCancel}
                  onRestore={onRestore}
                  onSoftDelete={onSoftDelete}
                  onHardDelete={onHardDelete}
                  categorias={categorias}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                  <span style={{ color: THEME.mediumColor, fontStyle: 'italic' }}>
                    {showDeleted
                      ? "No hay productos disponibles"
                      : "No hay productos activos"}
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
