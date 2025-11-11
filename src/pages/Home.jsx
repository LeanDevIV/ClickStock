import HeroHomePage from "../components/hero.jsx";
import BeneficiosHome from "../components/Beneficios.jsx";
import OfertaCarrusel from "../components/OfertaCarrusel.jsx";
function Home() {
  return (
    <div>
      <div>
        <HeroHomePage></HeroHomePage>
      </div>
      <div>
        <BeneficiosHome></BeneficiosHome>
      </div>
      <div>
        <OfertaCarrusel></OfertaCarrusel>{" "}
      </div>
    </div>
  );
}

export default Home;
