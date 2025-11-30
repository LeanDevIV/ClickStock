import { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import EditProfileModal from "./EditProfileModal";

export const UserMenu = ({ user, modoOscuro, handleLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenProfile = () => {
    setShowEditModal(true);
    handleMenuClose();
  };

  const nombre = user?.nombre || user?.nombre || user?.username || "?";
  const letra = nombre[0]?.toUpperCase();
  const avatarSrc = user?.fotoPerfil || user?.imagen || null;

  return (
    <>
      <Tooltip title="Ajustes de cuenta">
        <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
          <Avatar
            src={avatarSrc}
            sx={{
              width: 40,
              height: 40,
              bgcolor: modoOscuro ? "primary.dark" : "primary.main",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {!avatarSrc && letra}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 1.5,
            minWidth: 180,
            borderRadius: 2,
            bgcolor: modoOscuro ? "background.paper" : "background.default",
          },
        }}
      >
        <MenuItem onClick={handleOpenProfile}>Mi Perfil</MenuItem>

        {user?.rol === "admin" && (
          <MenuItem component={Link} to="/admin">
            Panel Admin
          </MenuItem>
        )}

        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          Cerrar sesión
        </MenuItem>
      </Menu>

      <EditProfileModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </>
  );
};
