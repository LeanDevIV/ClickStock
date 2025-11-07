import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export const MainLayout = ({ modoOscuro, toggleModo }) => {
  return (
    <>
      <Header modoOscuro={modoOscuro} toggleModo={toggleModo} />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
};
