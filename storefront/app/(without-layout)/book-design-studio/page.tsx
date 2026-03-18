import Header from "@/components/global/Header";
import FooterOne from "@/components/global/footer/FooterOne";
import HeroSection from "@/components/bookDesignStudio/HeroSection";
import HowItWorks from "@/components/bookDesignStudio/HowItWorks";
import ProductCardsSection2 from "@/components/bookDesignStudio/ProductCardsSection2";
import QuoteBookPlans from "@/components/bookDesignStudio/QuoteBookPlans";
import StartDesignQuote from "@/components/bookDesignStudio/StartDesignQuote";
import FeaturesSlider from "@/components/bookDesignStudio/FeaturesSlider";
import DesignForTeacher from "@/components/bookDesignStudio/DesignForTeacher";

function page() {
  return (
    <>
      <Header />
      <HeroSection />
      <HowItWorks />
      <ProductCardsSection2 />
      <QuoteBookPlans />
      <StartDesignQuote />
      <FeaturesSlider />
      <DesignForTeacher />
      <FooterOne />
    </>
  );
}

export default page;
