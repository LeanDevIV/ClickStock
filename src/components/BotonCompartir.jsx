import React, { useRef, useEffect } from "react";
import { useCompartir } from "../hooks/useCompartir";
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
  Paper,
  Tooltip,
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
import "../css/BotonCompartir.css";

const BotonCompartir = ({ idProducto, nombreProducto }) => {
  const {
    mostrarQR,
    mostrarOpciones,
    generarEnlace,
    alternarOpciones,
    alternarQR,
  } = useCompartir(idProducto, nombreProducto);

  const modalRef = useRef(null);
  const botonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mostrarOpciones &&
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        botonRef.current &&
        !botonRef.current.contains(event.target)
      ) {
        alternarOpciones();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mostrarOpciones, alternarOpciones]);

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
    alternarOpciones();
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

  const tooltipProps = {
    placement: "bottom",
    arrow: true,
    TransitionComponent: Fade,
  };

  return (
    <Box className="boton-compartir-container">
      <Tooltip title="Compartir producto" {...tooltipProps}>
        <IconButton
          ref={botonRef}
          color="primary"
          onClick={alternarOpciones}
          className="boton-compartir-icon"
        >
          <Share />
        </IconButton>
      </Tooltip>

      <Fade in={mostrarOpciones} timeout={300}>
        <Paper ref={modalRef} elevation={8} className="boton-compartir-modal">
          <Typography variant="subtitle2" className="modal-title">
            Compartir en:
          </Typography>

          <Box className="icon-container">
            <Tooltip title="WhatsApp" {...tooltipProps}>
              <IconButton
                color="success"
                onClick={handleWhatsApp}
                className="icon-button whatsapp"
              >
                <WhatsApp />
              </IconButton>
            </Tooltip>

            <Tooltip title="Email" {...tooltipProps}>
              <IconButton
                color="primary"
                onClick={handleEmail}
                className="icon-button email"
              >
                <Email />
              </IconButton>
            </Tooltip>

            <Tooltip title="Copiar enlace" {...tooltipProps}>
              <IconButton
                color="info"
                onClick={handleCopiarEnlace}
                className="icon-button link"
              >
                <Link />
              </IconButton>
            </Tooltip>

            <Tooltip title="Código QR" {...tooltipProps}>
              <IconButton
                color="secondary"
                onClick={handleQR}
                className="icon-button qr"
              >
                <QrCode2 />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      </Fade>

      <Dialog
        open={mostrarQR}
        onClose={alternarQR}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={400}
      >
        <DialogContent sx={{ position: "relative", p: 3 }}>
          {/* Botón cerrar en la esquina superior derecha */}
          <Tooltip title="Cerrar" {...tooltipProps}>
            <IconButton
              onClick={alternarQR}
              sx={{
                position: "absolute",
                right: 16,
                top: 16,
                color: "grey.500",
                zIndex: 1,
                "&:hover": {
                  bgcolor: "grey.100",
                },
              }}
            >
              <Close />
            </IconButton>
          </Tooltip>

          <Box className="qr-container">
            <Typography variant="h5" gutterBottom>
              Escanea el código QR
            </Typography>

            <Box className="qr-box">
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

        <DialogActions className="dialog-actions">
          <Tooltip title="Descargar QR" {...tooltipProps}>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleDescargarQR}
              className="download-button"
            >
              Descargar QR
            </Button>
          </Tooltip>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BotonCompartir;
