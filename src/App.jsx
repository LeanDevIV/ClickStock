import React from "react";
import AppRoutes from "./routes/indexroutes.jsx";
import FloatingChat from "./components/FloatingChat.jsx";
function App() {
  return (
    <div>
      <AppRoutes />
      <FloatingChat />
    </div>
  );
}

export default App;
