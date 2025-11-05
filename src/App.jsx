import AppRoutes from "./routes/Indexroutes.jsx";
import Footer from "./components/Footer.jsx";
import ProductosRender from "./components/ProductosRender.jsx";

function App() {
  return (
    <div>
      <AppRoutes />
      <ProductosRender />
      <Footer />
    </div>
  )
}
export default App;