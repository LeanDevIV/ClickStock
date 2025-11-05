import React from "react";
import AppRoutes from "./routes/indexroutes.jsx";
import FloatingChat from "./components/FloatingChat.jsx";
function App() {
  return (
    <div>
      <AppRoutes />
      <FloatingChat />
      <Footer />
    </div>
  );
}

export default App;
