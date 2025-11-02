import React, { useEffect } from "react";
import AppRoutes from "./routes/indexroutes.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <div>
      <AppRoutes />
      <Footer />
    </div>
  )
}
export default App;