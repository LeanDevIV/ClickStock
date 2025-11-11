import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import clientAxios from "../utils/clientAxios";
import { useStore } from "../hooks/useStore";
import { Container, Spinner } from "react-bootstrap";

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
        // Llamada protegida sólo para validar token
        await clientAxios.get("/usuarios");
        setChecking(false);
      } catch {
        // si el token es inválido el interceptor ya hará logout en 401, pero forzamos logout también
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
      <Container className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-3">Verificando permisos...</p>
      </Container>
    );
  }

  if (user?.rolUsuario !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminLayout;
