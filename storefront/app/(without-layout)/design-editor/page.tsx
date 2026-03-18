//@ts-nocheck
import Header from "@/components/global/Header";
import FooterOne from "@/components/global/footer/FooterOne";
import HeroSection from "@/components/designEditor/HeroSection";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import ProductCards from "@/components/designEditor/ProductCards";
import Discover from "@/components/designEditor/Discover";
import ProductCardsSection from "@/components/designEditor/ProductCardsSection";
import ProductCardsSection2 from "@/components/designEditor/ProductCardsSection2";
import ProductCardsSection3 from "@/components/designEditor/ProductCardsSection3";
import TrendingCreators from "@/components/doYouWorkOnIt/TrendingCreators";
import { getCustomer } from "@/lib/data/customer";
import { getProductsList } from "@/lib/data/products";

// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function page() {
  const customer = await getCustomer().catch(() => null);
  const countryCode = "gb"; 

  const queryParams = {
    order: "-created_at", 
    limit: 12,
  };

  // Add error handling for products fetch
  const products = await getProductsList({ queryParams, countryCode })
    .then(({ response }) => response.products)
    .catch((error) => {
      console.error("Error fetching products:", error);
      return [];
    });

  return (
    <>
      <Header />
      <HeroSection customer={customer} />
      <ProductCards products={products} />
      <Discover />
      <ProductCardsSection />
      <ProductCardsSection2 />
      <ProductCardsSection3 />
      <TrendingCreators />
      <ScrollToTopButton />
      <FooterOne />
    </>
  );
}

export default page;
