import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/layouts/Header";
import { Toolbar, Box } from "@mui/material";
import { useFavoritos } from "../hooks/useFavoritos";
import { useStore } from "../hooks/useStore";

export const MainLayout = ({
  modoOscuro,
  toggleModo,
  backgroundEnabled,
  toggleBackground,
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { cargarFavoritos } = useFavoritos();
  const { token } = useStore();

  const handleOpenAuth = () => setShowAuthModal(true);
  const handleCloseAuth = () => setShowAuthModal(false);

  useEffect(() => {
    if (token) {
      cargarFavoritos();
    }
  }, [token, cargarFavoritos]);

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
