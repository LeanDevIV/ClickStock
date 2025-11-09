import HeroHomePage from "../components/hero.jsx";
import BeneficiosHome from "../components/Beneficios.jsx"; 
function Home() {
  return (
    <div>
      <div>
        <HeroHomePage></HeroHomePage>
      </div>
      <div>
      <BeneficiosHome></BeneficiosHome>
      </div>
    </div>
  );
}

export default Home;
