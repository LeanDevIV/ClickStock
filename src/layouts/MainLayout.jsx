import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/layouts/Header";
import { Toolbar, Box } from "@mui/material";
import { useFavoritos } from "../hooks/useFavoritos";
import { useStore } from "../hooks/useStore";
import { auth } from "../config/firebase";
import { getRedirectResult } from "firebase/auth";
import { socialLoginService } from "../services/LoginService";

export const MainLayout = ({
  modoOscuro,
  toggleModo,
  backgroundEnabled,
  toggleBackground,
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { cargarFavoritos } = useFavoritos();
  const { token, setUser } = useStore();

  const handleOpenAuth = () => setShowAuthModal(true);
  const handleCloseAuth = () => setShowAuthModal(false);

  useEffect(() => {
    if (token) {
      cargarFavoritos();
    }
  }, [token, cargarFavoritos]);

  // Manejar el resultado del redirect de Firebase Auth
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          const firebaseToken = await result.user.getIdToken();
          const data = await socialLoginService(firebaseToken);

          if (data.usuario && data.token) {
            setUser(data.usuario, data.token);
          }
        }
      } catch (error) {
        console.error("Error al manejar redirect de Firebase:", error);
      }
    };

    handleRedirectResult();
  }, [setUser]);

  return (
    <>
      <Header
        modoOscuro={modoOscuro}
        toggleModo={toggleModo}
        backgroundEnabled={backgroundEnabled}
        toggleBackground={toggleBackground}
        showAuthModal={showAuthModal}
        handleOpenAuth={handleOpenAuth}
        handleCloseAuth={handleCloseAuth}
      />
      <Toolbar />
      <Box sx={{ mt: 3 }}>
        <main className="p-4">
          <Outlet context={{ handleOpenAuth }} />
        </main>
      </Box>
    </>
  );
};
