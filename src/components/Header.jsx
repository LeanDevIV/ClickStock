import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Form,
  FormControl,
  NavDropdown,
} from "react-bootstrap";
import RegistroLogin from "../pages/RegistroLogin";
import { useStore } from "../hooks/useStore";
import { Link, useNavigate } from "react-router-dom";
import { useScrollDirection } from "../hooks/useScrollDirection";
import "./Header.css";

export const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const showNavbar = useScrollDirection(10);

  const handleOpenAuth = () => setShowAuthModal(true);
  const handleCloseAuth = () => setShowAuthModal(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/buscar?query=${search}`);
      setSearch("");
    }
  };

  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
    <Navbar
      bg="light"
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

            {/* Mostrar enlaces de admin sólo si hay user y es admin */}
            {user?.rolUsuario === "admin" && (
              <>
                <Nav.Link as={Link} to="/admin/productos" className="mx-2 fw-medium text-danger">
                  Admin Productos
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/usuarios" className="mx-2 fw-medium text-danger">
                  Admin Usuarios
                </Nav.Link>
              </>
            )}

            {/* Buscador */}
            <Form className="d-flex mx-3" onSubmit={handleSubmit}>
              <FormControl
                type="search"
                placeholder="Buscar..."
                className="me-2 rounded-pill px-3 shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "200px" }}
              />
              <Button variant="outline-primary" type="submit" className="rounded-pill px-3">
                Buscar
              </Button>
            </Form>

            {/* Si hay usuario: mostrar dropdown con perfil y logout. Si no hay: mostrar botón de login */}
            {user ? (
              <NavDropdown title={user.nombreUsuario || "Cuenta"} id="basic-nav-dropdown" className="mx-2">
                <NavDropdown.Item as={Link} to="/perfil">
                  Mi Perfil
                </NavDropdown.Item>
                {/* Mostrar Panel Admin solo para usuarios que NO sean admin (evita duplicado) */}
                {user.rolUsuario !== "admin" && (
                  <NavDropdown.Item as={Link} to="/admin">
                    Panel Admin
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Cerrar sesión
                  </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button
                variant="primary"
                className="ms-2 px-4 fw-semibold rounded-pill"
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

