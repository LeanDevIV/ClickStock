import HeroHomePage from "../components/hero";
import BeneficiosHome from "../components/Beneficios";
import OfertaCarrusel from "../components/OfertaCarrusel";
import CategoriasBox from "../components/categoriasBox";
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
        <OfertaCarrusel></OfertaCarrusel>
      </div>
      <div>
        <CategoriasBox></CategoriasBox>
      </div>
    </div>
  );
}

export default Home;
