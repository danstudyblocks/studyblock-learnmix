import Header from "@/components/global/Header";
import FooterOne from "@/components/global/footer/FooterOne";
import Hero from "@/components/homeTwo/Hero";
import HowItWorks from "@/components/homeTwo/HowItWorks";
import Discover from "@/components/homeTwo/Discover";
import DiscoverDesign from "@/components/homeTwo/DiscoverDesign";
import TeacherSchoolPlans from "@/components/homeTwo/TeacherSchoolPlans";
import ProductCardsSection3 from "@/components/homeTwo/ProductCardsSection3";
import SellResource from "@/components/homeTwo/SellResource";

function page() {
  return (
    <>
      <Header />
      <Hero />
      <HowItWorks />
      <Discover />
      <DiscoverDesign />
      <TeacherSchoolPlans />
      <ProductCardsSection3 />
      <SellResource />
      <FooterOne />
    </>
  );
}

export default page;
