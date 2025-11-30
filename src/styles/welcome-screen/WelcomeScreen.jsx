import { useState, useEffect } from "react";
import TargetCursor from "../target-cursor/TargetCursor";
import Dither from "../dither/Dither";
import { Button, Typography, Box, Stack, IconButton } from "@mui/material";
import { GitHub, LinkedIn } from "@mui/icons-material";

const WelcomeScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setShouldRender(false);
    }
  }, []);

  const handleContinue = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenWelcome", "true");
    document.body.style.overflow = "unset";
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
      {/* Background Dither */}
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

      {/* Contenedor Glassmorphism */}
      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          p: 6,
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
          textAlign: "center",
          maxWidth: "500px",
          width: "90%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        {/* Logo */}
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "2px",
            textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
            fontSize: { xs: "2.5rem", md: "3.5rem" },
          }}
        >
          ClickStock
        </Typography>

        {/* Tagline */}
        <Typography
          variant="h6"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            fontWeight: 300,
            letterSpacing: "1px",
            fontSize: { xs: "1rem", md: "1.2rem" },
          }}
        >
          Tu tienda de tecnología de confianza
        </Typography>

        {/* Social Icons */}
        <Stack direction="row" spacing={2}>
          <IconButton
            href="https://github.com/LeanDevIV/ClickStock"
            target="_blank"
            sx={{
              color: "white",
              "&:hover": {
                color: "#D4AF37",
                transform: "scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
            className="cursor-target"
          >
            <GitHub fontSize="large" />
          </IconButton>
          <IconButton
            href="https://www.linkedin.com/in/leandro-c%C3%B3rdoba/"
            target="_blank"
            sx={{
              color: "white",
              "&:hover": {
                color: "#0077B5",
                transform: "scale(1.1)",
              },
              transition: "all 0.3s ease",
            }}
            className="cursor-target"
          >
            <LinkedIn fontSize="large" />
          </IconButton>
        </Stack>

        {/* Divider sutil */}
        <Box
          sx={{
            width: "50%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
            my: 1,
          }}
        />

        {/* Botón de Ingreso */}
        <Button
          variant="contained"
          className="cursor-target"
          onClick={handleContinue}
          sx={{
            px: 5,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: "50px",
            background: "linear-gradient(45deg, #000000, #333333)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            "&:hover": {
              background: "linear-gradient(45deg, #333333, #000000)",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.4)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Ingresar al Sitio
        </Button>
      </Box>
    </div>
  );
};

export default WelcomeScreen;
