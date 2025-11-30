import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CarritoPreview from "../cart/CarritoPreview";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  IconButton,
  InputBase,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

// 👈 RUTA DEL LOGO (Asegúrate de que 'logo-mouse.png' esté en la carpeta public/)
const LOGO_PATH = "/logo-mouse.png";

import {
  Search as SearchIcon,
  ShoppingCart,
  Menu as MenuIcon,
  Person,
  Brightness4,
  Brightness7,
  BlurOn,
  BlurOff,
  ReceiptLong,
  AdminPanelSettings,
  Favorite,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useStore } from "../../hooks/useStore";
import { useScrollDirection } from "../../hooks/useScrollDirection";
import { UserMenu } from "../auth/MenuUsuario";
import AuthModal from "../auth/AuthModal";
import "../../styles/header.css";

const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
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
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export const Header = ({
  modoOscuro,
  toggleModo,
  backgroundEnabled,
  toggleBackground,
  showAuthModal,
  handleOpenAuth,
  handleCloseAuth,
}) => {
  const theme = useTheme();
  const [showCarrito, setShowCarrito] = useState(false);
  const handleOpenPreview = () => setShowCarrito(true);
  const handleClosePreview = () => setShowCarrito(false);

  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const showNavbar = useScrollDirection(10);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const totalArticulos = useStore((state) => state.cart.totalArticulos);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/buscar?query=${search}`);
      setSearch("");
      setMobileOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box
        sx={{
          my: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
            fontSize: "1.2rem",
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: "1px",
          }}
        >
          <img
            src={LOGO_PATH}
            alt="ClickStock Logo"
            style={{
              height: 70,
              display: "block",
              filter: modoOscuro
                ? "drop-shadow(0 0 5px rgba(255, 255, 255, 0.4))"
                : "none",
            }}
          />
          <Box
            component="span"
            sx={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              color: "inherit",
              fontFamily: "'Orbitron', sans-serif",
            }}
          >
            ClickStock
          </Box>
        </Link>
      </Box>
      <Divider />
      <List></List>
      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleOpenPreview}>
            <Box sx={{ display: "flex", alignItems: "center", mx: "auto" }}>
              <Badge badgeContent={totalArticulos} color="error" sx={{ mr: 1 }}>
                <ShoppingCart />
              </Badge>
              <ListItemText primary="Carrito" />
            </Box>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/favoritos"
            onClick={handleDrawerToggle}
          >
            <Box sx={{ display: "flex", alignItems: "center", mx: "auto" }}>
              <Favorite sx={{ mr: 1 }} />
              <ListItemText primary="Favoritos" />
            </Box>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/mis-pedidos"
            onClick={handleDrawerToggle}
          >
            <Box sx={{ display: "flex", alignItems: "center", mx: "auto" }}>
              <ReceiptLong sx={{ mr: 1 }} />
              <ListItemText primary="Mis Pedidos" />
            </Box>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={toggleBackground}>
            <Box sx={{ display: "flex", alignItems: "center", mx: "auto" }}>
              {backgroundEnabled ? (
                <BlurOn sx={{ mr: 1 }} />
              ) : (
                <BlurOff sx={{ mr: 1 }} />
              )}
              <ListItemText
                primary={backgroundEnabled ? "Fondo On" : "Fondo Off"}
              />
            </Box>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={toggleModo}>
            <Box sx={{ display: "flex", alignItems: "center", mx: "auto" }}>
              {modoOscuro ? (
                <Brightness7 sx={{ mr: 1 }} />
              ) : (
                <Brightness4 sx={{ mr: 1 }} />
              )}
              <ListItemText primary={modoOscuro ? "Claro" : "Oscuro"} />
            </Box>
          </ListItemButton>
        </ListItem>

        {user?.rol === "admin" && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin">
              <Box sx={{ display: "flex", alignItems: "center", mx: "auto" }}>
                <AdminPanelSettings
                  sx={{ mr: 1, color: theme.palette.warning.main }}
                />
                <ListItemText primary="Panel Admin" />
              </Box>
            </ListItemButton>
          </ListItem>
        )}

        <ListItem disablePadding>
          {user ? (
            <ListItemButton onClick={handleLogout}>
              <Box sx={{ display: "flex", alignItems: "center", mx: "auto" }}>
                <Person sx={{ mr: 1 }} />
                <ListItemText primary="Cerrar Sesión" />
              </Box>
            </ListItemButton>
          ) : (
            <ListItemButton onClick={handleOpenAuth}>
              <Box sx={{ display: "flex", alignItems: "center", mx: "auto" }}>
                <Person sx={{ mr: 1 }} />
                <ListItemText primary="Ingresar" />
              </Box>
            </ListItemButton>
          )}
        </ListItem>
      </List>
    </Box>
  );
  return (
    <>
      <AppBar
        position="fixed"
        color="transparent"
        elevation={isScrolled ? 4 : 0}
        className={`navbar-transition ${
          showNavbar ? "navbar-visible" : "navbar-hidden"
        } ${isScrolled ? "glass-navbar" : "transparent-navbar"}`}
        sx={{
          color: "text.primary",
          transition: "all 0.3s ease",
          bgcolor: isScrolled
            ? modoOscuro
              ? "rgba(18, 18, 18, 0.8)"
              : "rgba(255, 255, 255, 0.8)"
            : "transparent",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: "1px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <img
                  src={LOGO_PATH}
                  alt="ClickStock Logo"
                  style={{
                    height: 70,
                    display: "block",
                    filter: modoOscuro
                      ? "drop-shadow(0 0 5px rgba(255, 255, 255, 0.4))"
                      : "none",
                  }}
                />
                <Box
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.75rem",
                    color: "inherit",
                    fontFamily: "'Orbitron', sans-serif",
                  }}
                >
                  ClickStock
                </Box>
              </Link>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: "1px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {/* Imagen del Logo */}
                <img
                  src={LOGO_PATH}
                  alt="ClickStock Logo"
                  style={{
                    height: 65,
                    display: "block",
                    filter: modoOscuro
                      ? "drop-shadow(0 0 5px rgba(255, 255, 255, 0.4))"
                      : "none",
                  }}
                />
                {/* Texto del Nombre */}
                <Box
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    color: "inherit",
                    fontFamily: "'Orbitron', sans-serif",
                  }}
                >
                  ClickStock
                </Box>
              </Link>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                gap: 2,
              }}
            ></Box>

            <Box
              sx={{
                flexGrow: 0,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <form onSubmit={handleSubmit}>
                <SearchContainer>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Buscar..."
                    inputProps={{ "aria-label": "search" }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </SearchContainer>
              </form>

              <Tooltip title="Mis Favoritos">
                <IconButton component={Link} to="/favoritos" color="inherit">
                  <Favorite />
                </IconButton>
              </Tooltip>
              <Tooltip title="Mis pedidos">
                <IconButton component={Link} to="/mis-pedidos" color="inherit">
                  <ReceiptLong />
                </IconButton>
              </Tooltip>

              <IconButton onClick={handleOpenPreview} color="inherit">
                <Badge badgeContent={totalArticulos} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>

              <Tooltip
                title={backgroundEnabled ? "Desactivar Fondo" : "Activar Fondo"}
              >
                <IconButton onClick={toggleBackground} color="inherit">
                  {backgroundEnabled ? <BlurOn /> : <BlurOff />}
                </IconButton>
              </Tooltip>

              <IconButton onClick={toggleModo} color="inherit">
                {modoOscuro ? <Brightness7 /> : <Brightness4 />}
              </IconButton>

              {user?.rol === "admin" && (
                <Tooltip title="Panel de Administración">
                  <IconButton
                    component={Link}
                    to="/admin"
                    color="inherit"
                    sx={{ color: theme.palette.warning.main }}
                  >
                    <AdminPanelSettings />
                  </IconButton>
                </Tooltip>
              )}

              {user ? (
                <UserMenu
                  user={user}
                  modoOscuro={modoOscuro}
                  handleLogout={handleLogout}
                />
              ) : (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleOpenAuth}
                  startIcon={<Person />}
                  size="small"
                >
                  Ingresar
                </Button>
              )}
            </Box>

            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="menu"
                onClick={handleDrawerToggle}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <nav>
        <Drawer
          anchor="right"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </nav>

      <AuthModal
        show={showAuthModal}
        handleClose={handleCloseAuth}
        setMensaje={() => {}}
      />
      <CarritoPreview show={showCarrito} handleClose={handleClosePreview} />
    </>
  );
};
