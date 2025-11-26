import HeroHomePage from "../components/hero";
import BeneficiosHome from "../components/Beneficios";

import LiquidEther from "../styles/liquid-ether/LiquidEther";

function Home() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
      {/* Background animado - posición absoluta */}
      {/* <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div> */}

      {/* Contenido principal - posición relativa para estar encima */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <HeroHomePage />
        <BeneficiosHome />
      </div>
    </div>
  );
}

export default Home;
