import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Card,
  Typography,
  Stack,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { AccessTime, CalendarToday, Lock } from "@mui/icons-material";
import { setItem } from "../utils/localStorageHelper";

function getTargetDate() {
  return new Date(2025, 11, 1, 19, 0, 0, 0);
}

function formatTime(msRemaining) {
  const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000));
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export default function CountdownPage({ onLogin }) {
  const targetDate = useMemo(() => getTargetDate(), []);
  const [remainingMs, setRemainingMs] = useState(() => targetDate - new Date());

  const [openAuth, setOpenAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      setRemainingMs(targetDate - new Date());
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const isOver = remainingMs <= 0;

  useEffect(() => {
    if (isOver && onLogin) {
      onLogin();
    }
  }, [isOver, onLogin]);

  const { days, hours, minutes, seconds } = formatTime(remainingMs);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const hoursPct = Math.round((hours / 24) * 100);
  const minutesPct = Math.round((minutes / 60) * 100);
  const secondsPct = Math.round((seconds / 60) * 100);

  const niceTarget = targetDate.toLocaleString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleLogin = () => {
    if (password === "ClickStock") {
      setItem("site_access_granted", true);
      setOpenAuth(false);
      if (onLogin) onLogin();
    } else {
      setError("Contraseña incorrecta");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #f8f9ff 100%)",
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            p: { xs: 2, md: 5 },
            textAlign: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 50,
              bgcolor: "action.hover",
              color: "text.secondary",
              mb: 3,
            }}
          >
            <AccessTime fontSize="small" />
            <Typography variant="caption" fontWeight="bold">
              Cuenta regresiva
            </Typography>
          </Box>

          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            gutterBottom
            sx={{ fontSize: { xs: "2.5rem", sm: "3rem", md: "3.75rem" } }}
          >
            Lanzamiento
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
            mb={4}
            color="text.secondary"
          >
            <CalendarToday fontSize="small" />
            <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
              {niceTarget}
            </Typography>
          </Stack>

          {isOver ? (
            <Typography variant="h3" color="success.main" fontWeight="bold">
              ¡Ya comenzó!
            </Typography>
          ) : (
            <>
              <Stack
                direction="row"
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
                spacing={{ xs: 0.5, sm: 2, md: 3 }}
                mb={4}
              >
                <TimeBox label="Días" value={days} subtle />
                <Typography variant="h4" color="text.secondary">
                  :
                </Typography>
                <TimeBox label="Horas" value={hours} progress={hoursPct} />
                <Typography variant="h4" color="text.secondary">
                  :
                </Typography>
                <TimeBox label="Min" value={minutes} progress={minutesPct} />
                <Typography variant="h4" color="text.secondary">
                  :
                </Typography>
                <TimeBox
                  label="Seg"
                  value={seconds}
                  progress={secondsPct}
                  highlight
                />
              </Stack>

              <Typography variant="caption" color="text.secondary">
                Zona horaria: {timezone}
              </Typography>
            </>
          )}

          <Box position="absolute" bottom={16} right={16}>
            <IconButton
              onClick={() => setOpenAuth(true)}
              color="primary"
              size="small"
              sx={{ opacity: 0.5, "&:hover": { opacity: 1 } }}
            >
              <Lock fontSize="small" />
            </IconButton>
          </Box>
        </Card>
      </Container>

      <Dialog open={openAuth} onClose={() => setOpenAuth(false)}>
        <DialogTitle>Acceso Administrativo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Clave de Acceso"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            error={!!error}
            helperText={error}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAuth(false)}>Cancelar</Button>
          <Button onClick={handleLogin} variant="contained">
            Entrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function TimeBox({ label, value, progress, highlight, subtle }) {
  const padded = String(value).padStart(2, "0");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: subtle ? "background.paper" : "primary.light",
        backgroundColor: subtle ? "#fff" : "rgba(25, 118, 210, 0.08)",
        borderRadius: 4,
        border: subtle ? "1px solid" : "none",
        borderColor: "divider",
        minWidth: { xs: 55, sm: 90, md: 110 },
        p: { xs: 1, md: 2 },
        boxShadow: subtle ? 1 : 0,
      }}
    >
      <Typography
        variant="h3"
        fontWeight="bold"
        color={highlight ? "primary.main" : "text.primary"}
        sx={{ lineHeight: 1, mb: 1, fontSize: { xs: "1.5rem", md: "3rem" } }}
      >
        {padded}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        mb={1}
        sx={{ fontSize: { xs: "0.7rem", md: "0.875rem" } }}
      >
        {label}
      </Typography>
      {typeof progress === "number" && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ width: "100%", height: 6, borderRadius: 3 }}
        />
      )}
    </Box>
  );
}
