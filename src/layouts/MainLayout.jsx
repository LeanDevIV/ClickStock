import { Outlet } from "react-router-dom";
import { Header } from "../components/layouts/Header";

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
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
};
