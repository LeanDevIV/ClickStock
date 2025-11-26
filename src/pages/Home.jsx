import HeroHomePage from "../components/hero";
import BeneficiosHome from "../components/Beneficios";

function Home() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
      {/* Contenido principal - posición relativa para estar encima */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <HeroHomePage />
        <BeneficiosHome />
      </div>
    </div>
  );
}

export default Home;
