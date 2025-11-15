import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  InputBase,
  Switch,
  Tooltip,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  Brightness7,
  Brightness4,
  Search as SearchIcon,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useStore } from "../hooks/useStore";
import { useScrollDirection } from "../hooks/useScrollDirection";
import { UserMenu } from "./MenuUsuario";
import RegistroLogin from "../pages/RegistroLogin";
import "./Header.css";

// === 🔍 Estilos del buscador ===
const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

// === 🧠 Componente principal ===
export const Header = ({ modoOscuro, toggleModo }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const showNavbar = useScrollDirection(10);

  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/buscar?query=${search}`);
      setSearch("");
    }
  };

  const handleOpenAuth = () => setShowAuthModal(true);
  const handleCloseAuth = () => setShowAuthModal(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <Navbar
        bg={modoOscuro ? "dark" : "light"}
        variant={modoOscuro ? "dark" : "light"}
        expand="lg"
        className={`shadow-sm py-3 sticky-top navbar-transition ${
          showNavbar ? "navbar-visible" : "navbar-hidden"
        }`}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-primary">
            Click<span className="text-dark">Stock</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" />

          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/" className="mx-2 fw-medium">
                Inicio
              </Nav.Link>
              <Nav.Link as={Link} to="/productos" className="mx-2 fw-medium">
                Productos
              </Nav.Link>
              <Nav.Link as={Link} to="/contacto" className="mx-2 fw-medium">
                Contacto
              </Nav.Link>

              {/* Enlaces de admin - CORREGIDO: SIN ANIDAMIENTO PERO MANTENIENDO ESTILO */}
              {user?.rolUsuario === "admin" && (
                <div className="mx-2">
                  {" "}
                  {/* Contenedor div en lugar de Nav.Link */}
                  <ButtonGroup variant="text" className="text-danger">
                    <Tooltip title="Admin">
                      <Button
                        component={Link}
                        to="/admin/dashboard"
                        color="error"
                        className="text-danger"
                      >
                        <AdminPanelSettings />
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                </div>
              )}

              {/* 🔍 Buscador */}
              <Box component="form" onSubmit={handleSubmit}>
                <SearchContainer>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Buscar..."
                    inputProps={{ "aria-label": "buscar" }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </SearchContainer>
              </Box>

              {/* 🌙/☀️ Modo oscuro */}
              <div className="d-flex align-items-center ms-3">
                <IconButton color="inherit" onClick={toggleModo}>
                  {modoOscuro ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                <Switch
                  checked={modoOscuro}
                  onChange={toggleModo}
                  color="default"
                />
              </div>

              {/* 👤 Usuario / Login */}
              {user ? (
                <UserMenu
                  user={user}
                  modoOscuro={modoOscuro}
                  handleLogout={handleLogout}
                />
              ) : (
                <Button
                  color="inherit"
                  className="ms-2 px-4"
                  onClick={handleOpenAuth}
                >
                  Iniciar sesión
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <RegistroLogin show={showAuthModal} onHide={handleCloseAuth} />
    </>
  );
};
