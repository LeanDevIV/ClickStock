import { useState, useEffect } from "react";
import "./WelcomeScreen.css";
import TargetCursor from "../styles/target-cursor/TargetCursor";
import Dither from "../styles/dither/Dither";
import { Button } from "@mui/material";

const WelcomeScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setIsVisible(true);
      // Bloquear scroll cuando está visible
      document.body.style.overflow = "hidden";
    } else {
      setShouldRender(false);
    }
  }, []);

  const handleContinue = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenWelcome", "true");
    // Restaurar scroll
    document.body.style.overflow = "unset";

    // Esperar a que termine la animación para desmontar
    setTimeout(() => {
      setShouldRender(false);
    }, 800);
  };

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 2,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.8s ease-in-out",
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <Dither
        zIndex={1}
        waveColor={[1, 1, 1]}
        disableAnimation={false}
        enableMouseInteraction={true}
        mouseRadius={0.3}
        colorNum={4}
        waveAmplitude={0.3}
        waveFrequency={3}
        waveSpeed={0.05}
      />
      <TargetCursor
        zIndex={2}
        hideDefaultCursor={true}
        parallaxOn={true}
        spinDuration={2}
        hoverDuration={0.2}
      />

      <Button zIndex={3} className=" cursor-target" onClick={handleContinue}>
        Ingresar al Sitio
      </Button>
    </div>
  );
};

export default WelcomeScreen;
