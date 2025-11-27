import { useState, useEffect } from "react";
import TargetCursor from "../target-cursor/TargetCursor";
import Dither from "../dither/Dither";
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
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9998,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.8s ease-in-out",
        pointerEvents: isVisible ? "auto" : "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <Dither
          zIndex={1}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>
      <TargetCursor
        zIndex={2}
        parallaxOn={true}
        spinDuration={2}
        hoverDuration={0.2}
      />

      <Button
        variant="outlined"
        sx={{
          zIndex: 10,
          position: "relative",
          backgroundColor: "black",
          color: "white",
          "&:hover": {
            backgroundColor: "white",
            color: "black",
          },
        }}
        className="cursor-target"
        onClick={handleContinue}
      >
        Ingresar al Sitio
      </Button>
    </div>
  );
};

export default WelcomeScreen;
