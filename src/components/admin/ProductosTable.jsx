import React from "react";
import { THEME } from "../../config/adminConfig";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

import { ProductRow } from "../tableComponents/ProductRow";

export const ProductosTable = ({
  data,
  editingId,
  editedData,
  onEdit,
  onSave,
  onCancel,
  onFieldChange,
  onRestore,
}) => {
  const tableHeader = [
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
    { key: "precio", label: "Precio" },
    { key: "categoria", label: "Categoría" },
    { key: "stock", label: "Stock" },
    { key: "disponible", label: "Disponible" },
    { key: "isDeleted", label: "Eliminado" },
    { key: "actions", label: "Acciones", align: "center" },
  ];
  return (
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
          {data.map((producto) => (
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
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
