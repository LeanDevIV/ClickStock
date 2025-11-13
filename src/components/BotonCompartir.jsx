import React from "react";
import { useCompartir } from "../hooks/useCompartir";
import { QRCodeSVG } from "qrcode.react";
import toast from 'react-hot-toast'; 
import {
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Share,
  Check,
  Close,
  Download,
  WhatsApp,
  Email,
  Link,
  QrCode2,
} from "@mui/icons-material";

const BotonCompartir = ({ idProducto, nombreProducto }) => {
  const {
    enlaceCopiado,
    mostrarQR,
    mostrarOpciones,
    generarEnlace,
    copiarEnlace,
    alternarOpciones,
    alternarQR,
  } = useCompartir(idProducto, nombreProducto);

  return (
    <Box sx={{ position: "relative", maxWidth: 350 }}>
      <Button
        variant="contained"
        color={enlaceCopiado ? "success" : "primary"}
        onClick={copiarEnlace}
        disabled={enlaceCopiado}
        startIcon={enlaceCopiado ? <Check /> : <Share />}
        fullWidth
        sx={{
          mb: 1,
          py: 1.5,
          fontWeight: "bold",
          fontSize: "1rem",
        }}
      >
        {enlaceCopiado ? "¡Enlace copiado!" : "Compartir producto"}
      </Button>
      <Button
        variant="outlined"
        onClick={alternarOpciones}
        endIcon={mostrarOpciones ? "‹" : "›"}
        fullWidth
        sx={{ mb: 2 }}
      >
        {mostrarOpciones ? "Ocultar opciones" : "Más opciones"}
      </Button>
      {mostrarOpciones && (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent sx={{ "&:last-child": { pb: 2 } }}>
            <Typography variant="h6" gutterBottom>
              Compartir en:
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<WhatsApp />}
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(
                      `Mira este producto: ${nombreProducto} - ${generarEnlace()}`
                    )}`,
                    "_blank"
                  )
                }
                fullWidth
              >
                WhatsApp
              </Button>

              <Button
                variant="outlined"
                startIcon={<Email />}
                onClick={() =>
                  window.open(
                    `mailto:?subject=${encodeURIComponent(
                      nombreProducto
                    )}&body=${encodeURIComponent(
                      `Mira este producto: ${generarEnlace()}`
                    )}`
                  )
                }
                fullWidth
              >
                Email
              </Button>

              <Button
                variant="outlined"
                startIcon={<Link />}
                onClick={() => {
                  toast((t) => (
                    <Box sx={{ minWidth: 300 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Enlace para copiar:
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        wordBreak: 'break-all',
                        bgcolor: 'grey.100',
                        p: 1,
                        borderRadius: 1,
                        mb: 1
                      }}>
                        {generarEnlace()}
                      </Typography>
                      <Button 
                        variant="contained" 
                        size="small" 
                        onClick={() => {
                          navigator.clipboard.writeText(generarEnlace());
                          toast.success('¡Enlace copiado!');
                        }}
                        fullWidth
                      >
                        Copiar enlace
                      </Button>
                    </Box>
                  ), {
                    duration: 10000,
                  });
                }}
                fullWidth
              >
                Mostrar enlace
              </Button>

              <Button
                variant="contained"
                startIcon={<QrCode2 />}
                onClick={alternarQR}
                fullWidth
                sx={{ mt: 1 }}
              >
                {mostrarQR ? "Ocultar QR" : "Mostrar QR"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
      <Dialog
        open={mostrarQR}
        onClose={alternarQR}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <Box sx={{ textAlign: "center", position: "relative" }}>
            <IconButton
              onClick={alternarQR}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "grey.500",
              }}
            >
              <Close />
            </IconButton>

            <Typography variant="h5" gutterBottom>
              Escanea el código QR
            </Typography>

            <Box
              sx={{
                p: 2,
                bgcolor: "white",
                borderRadius: 2,
                border: 1,
                borderColor: "grey.300",
                display: "inline-block",
                my: 2,
              }}
            >
              <QRCodeSVG
                value={generarEnlace()}
                size={200}
                level="H"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Escanea con tu cámara para acceder al producto
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => {
              const svg = document.querySelector(".MuiDialogContent svg");
              if (svg) {
                const svgData = new XMLSerializer().serializeToString(svg);
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                const img = new Image();

                img.onload = () => {
                  canvas.width = img.width;
                  canvas.height = img.height;
                  ctx.drawImage(img, 0, 0);
                  const pngFile = canvas.toDataURL("image/png");

                  const downloadLink = document.createElement("a");
                  downloadLink.download = `qr-${nombreProducto}.png`;
                  downloadLink.href = pngFile;
                  downloadLink.click();
                  toast.success('QR descargado correctamente');
                };

                img.src = "data:image/svg+xml;base64," + btoa(svgData);
              } else {
                toast.error('Error al generar el QR para descargar');
              }
            }}
          >
            Descargar QR
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BotonCompartir;