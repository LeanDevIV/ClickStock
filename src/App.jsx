import React, { useEffect } from "react";
import AppRoutes from "./routes/indexroutes.jsx";
import Footer from "./components/Footer.jsx";
import CarouselProgress from "./components/hero.jsx";

function App() {
  return (
    <div>
      <AppRoutes />
      
      
 <CarouselProgress />
      <Footer />
     
    </div>
  )
}
export default App;