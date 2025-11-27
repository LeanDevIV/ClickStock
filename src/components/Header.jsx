import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CarritoPreview from "./CarritoPreview";
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
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  Search as SearchIcon,
  ShoppingCart,
  Menu as MenuIcon,
  Person,
  Brightness4,
  Brightness7,
  BlurOn,
  BlurOff,
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useStore } from "../hooks/useStore";
import { useScrollDirection } from "../hooks/useScrollDirection";
import { UserMenu } from "./MenuUsuario";
import AuthModal from "./AuthModal";
import "./Header.css";

// Search Styles
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

export const Header = ({ modoOscuro, toggleModo, backgroundEnabled,
  toggleBackground, }) => {
  const [showCarrito, setShowCarrito] = useState(false);
  const handleOpenPreview = () => setShowCarrito(true);
  const handleClosePreview = () => setShowCarrito(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const showNavbar = useScrollDirection(10);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const totalArticulos = useStore((state) => state.cart.totalArticulos);
  const carrito = useStore((state) => state.cart);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/buscar?query=${search}`);
      setSearch("");
      setMobileOpen(false);
    }
  };

  const handleOpenAuth = () => setShowAuthModal(true);
  const handleCloseAuth = () => setShowAuthModal(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleGoToCart = () => {
    navigate("/carrito");
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { title: "Inicio", path: "/" },
    { title: "Productos", path: "/productos" },
    { title: "Nosotros", path: "/acerca" },
    { title: "Contacto", path: "/contacto" },
  ];

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
      <Box sx={{ my: 2 }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          ClickStock
        </Link>
      </Box>
      <List>
        {navLinks.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <AppBar
        position="fixed" // Changed to fixed for better glass effect overlay
        color="transparent" // Transparent base
        elevation={isScrolled ? 4 : 0}
        className={`navbar-transition ${
          showNavbar ? "navbar-visible" : "navbar-hidden"
        } ${isScrolled ? "glass-navbar" : "transparent-navbar"}`}
        sx={{
          color: isHome && !isScrolled ? "#FFFFFF" : "text.primary",
          transition: "all 0.3s ease",
          bgcolor: isScrolled
            ? modoOscuro
              ? "rgba(18, 18, 18, 0.7)"
              : "rgba(255, 255, 255, 0.7)"
            : "transparent",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo Desktop */}
            <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
              >
                ClickStock
              </Link>
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="menu"
                onClick={handleDrawerToggle}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Logo Mobile */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                ClickStock
              </Link>
            </Box>

            {/* Desktop Nav Links */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                gap: 2,
              }}
            >
              {navLinks.map((page) => (
                <Button
                  key={page.title}
                  component={Link}
                  to={page.path}
                  sx={{ my: 2, color: "inherit", display: "block" }}
                >
                  {page.title}
                </Button>
              ))}
            </Box>

            {/* Search, Cart, Dark Mode, User */}
            <Box
              sx={{
                flexGrow: 0,
                display: "flex",
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
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <nav>
        <Drawer
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
