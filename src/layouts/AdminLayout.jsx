import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import clientAxios from "../utils/clientAxios";
import { useStore } from "../hooks/useStore";
import { Container, CircularProgress, Typography, Box } from "@mui/material";

const AdminLayout = () => {
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!user) {
        setChecking(false);
        return;
      }
      try {
        await clientAxios.get("/usuarios");
        setChecking(false);
      } catch {
        logout();
        setChecking(false);
      }
    };
    verify();
  }, [user, logout]);

  if (!user && !checking) {
    return <Navigate to="/" replace />;
  }

  if (checking) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", py: 5 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 3 }}>
            Verificando permisos...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (user?.rol !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminLayout;
