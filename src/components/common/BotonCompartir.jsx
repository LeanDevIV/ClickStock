import React, { useEffect } from "react";
import { useCompartir } from "../../hooks/useCompartir";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import {
  Box,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Fade,
  Tooltip,
  Grid,
} from "@mui/material";
import {
  Share,
  Close,
  Download,
  WhatsApp,
  Email,
  Link,
  QrCode2,
} from "@mui/icons-material";

const BotonCompartir = ({ idProducto, nombreProducto }) => {
  const {
    mostrarQR,
    mostrarOpciones,
    generarEnlace,
    alternarOpciones,
    alternarQR,
  } = useCompartir(idProducto, nombreProducto);
  useEffect(() => {
    const removeAriaHidden = () => {
      const rootElement = document.getElementById('root');
      if (rootElement && rootElement.getAttribute('aria-hidden') === 'true') {
        rootElement.removeAttribute('aria-hidden');
      }
    };

    if (!mostrarOpciones && !mostrarQR) {
      setTimeout(removeAriaHidden, 100);
    }
  }, [mostrarOpciones, mostrarQR]);

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        `Mira este producto: ${nombreProducto} - ${generarEnlace()}`
      )}`,
      "_blank"
    );
    alternarOpciones();
  };

  const handleEmail = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent(
        nombreProducto
      )}&body=${encodeURIComponent(`Mira este producto: ${generarEnlace()}`)}`
    );
    alternarOpciones();
  };

  const handleCopiarEnlace = () => {
    navigator.clipboard.writeText(generarEnlace());
    toast.success("¡Enlace copiado al portapapeles!");
    alternarOpciones();
  };

  const handleQR = () => {
    alternarQR();
  };

  const handleCloseQR = () => {
    alternarQR();
    setTimeout(() => {
      document.body.focus();
    }, 50);
  };

  const handleCloseOpciones = () => {
    alternarOpciones();
    setTimeout(() => {
      document.body.focus();
    }, 50);
  };

  const handleDescargarQR = () => {
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
        toast.success("QR descargado correctamente");
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    } else {
      toast.error("Error al generar el QR para descargar");
    }
  };

  return (
    <Box>
      <Tooltip title="Compartir producto" placement="bottom" arrow>
        <IconButton
          color="primary"
          onClick={alternarOpciones}
        >
          <Share />
        </IconButton>
      </Tooltip>

      {/* Modal para opciones de compartir */}
      <Dialog
        open={mostrarOpciones}
        onClose={handleCloseOpciones}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        disableEnforceFocus={true}
        disableAutoFocus={true}
      >
        <DialogContent sx={{ position: "relative", p: 3 }}>
          <IconButton
            onClick={handleCloseOpciones}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "grey.500",
            }}
          >
            <Close />
          </IconButton>

          <Typography variant="h5" gutterBottom textAlign="center" fontWeight="bold">
            Compartir Producto
          </Typography>

          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            {nombreProducto}
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<WhatsApp />}
                onClick={handleWhatsApp}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: "#25D366",
                  color: "#25D366",
                }}
              >
                WhatsApp
              </Button>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Email />}
                onClick={handleEmail}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: "#EA4335",
                  color: "#EA4335",
                }}
              >
                Email
              </Button>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Link />}
                onClick={handleCopiarEnlace}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Copiar Enlace
              </Button>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<QrCode2 />}
                onClick={handleQR}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Código QR
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Modal para QR */}
      <Dialog
        open={mostrarQR}
        onClose={handleCloseQR}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        disableEnforceFocus={true}
        disableAutoFocus={true}
      >
        <DialogContent sx={{ position: "relative", p: 3, textAlign: "center" }}>
          <IconButton
            onClick={handleCloseQR}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "grey.500",
            }}
          >
            <Close />
          </IconButton>

          <Typography variant="h5" gutterBottom fontWeight="bold">
            Escanea el código QR
          </Typography>

          <Box sx={{ my: 3 }}>
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

          <DialogActions sx={{ justifyContent: 'center', pt: 2 }}>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleDescargarQR}
              sx={{ borderRadius: 2 }}
            >
              Descargar QR
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BotonCompartir;