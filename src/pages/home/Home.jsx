import HeroHomePage from "../../components/home/Hero";
import BeneficiosHome from "../../components/home/Beneficios";
import ProductosHome from "../../components/home/ProductosHome.jsx"

function Home() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
      {/* Contenido principal - posición relativa para estar encima */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <HeroHomePage />
        <BeneficiosHome />
        <ProductosHome />
      </div>
    </div>
  );
}

export default Home;
