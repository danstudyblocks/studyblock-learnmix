import Header from "@/components/global/Header";
import FooterOne from "@/components/global/footer/FooterOne";
import HeroSection from "@/components/marketplaceForEducators/HeroSection";
import ProductCardsSection2 from "@/components/marketplaceForEducators/ProductCardsSection2";
import TrendingCreators from "@/components/doYouWorkOnIt/TrendingCreators";
import FeaturesSlider from "@/components/marketplaceForEducators/FeaturesSlider";
import LeadingCommission from "@/components/marketplaceForEducators/LeadingCommission";
import DesignForTeacher from "@/components/marketplaceForEducators/DesignForTeacher";
import CreatorsOption from "@/components/marketplaceForEducators/CreatorsOption";
import { getProductsList } from "@/lib/data/products";


async function page() {
    const countryCode = "gb"; 
  
    const queryParams = {
      order: "-created_at", 
      limit: 12,
    };
  
  
    const products = await getProductsList({ queryParams, countryCode }).then(
      ({ response }) => response.products
    );
  
  return (
    <>
      <Header />
      <HeroSection/>
      <CreatorsOption/>
      <ProductCardsSection2 products={products} />
      <DesignForTeacher/>
      <LeadingCommission/>
      <TrendingCreators/>
      <FeaturesSlider/>
      <FooterOne />
    </>
  );
}

export default page;
