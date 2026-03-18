import Header from "@/components/global/Header";
import FooterOne from "@/components/global/footer/FooterOne";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import CompanyFeatures from "@/components/doYouWorkOnIt/CompanyFeatures";
import HeroSection from "@/components/doYouWorkOnIt/HeroSection";
import ProductCards from "@/components/doYouWorkOnIt/ProductCards";
import Discover from "@/components/doYouWorkOnIt/Discover";
import ProductCardsSection3 from "@/components/doYouWorkOnIt/ProductCardsSection3";
import TrendingCreators from "@/components/doYouWorkOnIt/TrendingCreators";
import { getRegion } from "@lib/data/regions";
import { getProductsList } from "@lib/data/products";

export default async function Home() {
  const countryCode = "gb"; 

  const queryParams = {
    order: "-created_at", 
    limit: 12,
  };


  const products = await getProductsList({ queryParams, countryCode }).then(
    ({ response }) => response.products
  );

  return (
    <main>
      <Header />
      <HeroSection />
      <CompanyFeatures />
      <ProductCards products={products} />
      <Discover />
      <ProductCardsSection3 products={products} />
      <TrendingCreators />
      <FooterOne />
      <ScrollToTopButton />
    </main>
  );
}
