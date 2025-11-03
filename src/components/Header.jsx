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
import { Link, useNavigate } from "react-router-dom";
import { useScrollDirection } from "../hooks/useScrollDirection";
import "./Header.css";

const Header = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const showNavbar = useScrollDirection(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/buscar?query=${search}`);
      setSearch("");
    }
  };

  return (
    <Navbar
      bg="light"
      expand="lg"
      className={`shadow-sm py-3 fixed-top navbar-transition ${
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

            {/* Dropdown cuenta */}
            <NavDropdown title="Cuenta" id="basic-nav-dropdown" className="mx-2">
              <NavDropdown.Item as={Link} to="/perfil">
                Mi Perfil
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin">
                Panel Admin
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/logout">
                Cerrar sesión
              </NavDropdown.Item>
            </NavDropdown>

            {/* Botón login */}
            <Button
              as={Link}
              to="/login"
              variant="primary"
              className="ms-2 px-4 fw-semibold rounded-pill"
            >
              Iniciar sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
