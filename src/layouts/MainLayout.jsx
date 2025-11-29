import { Outlet } from "react-router-dom";
import { Header } from "../components/layouts/Header";
import { Toolbar, Box } from "@mui/material";

export const MainLayout = ({
  modoOscuro,
  toggleModo,
  backgroundEnabled,
  toggleBackground,
}) => {
  return (
    <>
      <Header
        modoOscuro={modoOscuro}
        toggleModo={toggleModo}
        backgroundEnabled={backgroundEnabled}
        toggleBackground={toggleBackground}
      />
      <Toolbar />
      <Box sx={{ mt: 3 }}>
        <main className="p-4">
          <Outlet />
        </main>
      </Box>
    </>
  );
};
