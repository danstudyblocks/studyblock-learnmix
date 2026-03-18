import FixedPriceService from "@/components/designEditor/FixedPriceService";
import FixedPriceService2 from "@/components/designEditor/FixedPriceService2";
import GetHelpToday from "@/components/designEditor/GetHelpToday";
import GetWorkersGigs from "@/components/designEditor/GetWorkersGigs";
import NewsLetter from "@/components/designEditor/NewsLetter";
import SecureGuard from "@/components/designEditor/SecureGuard";
import HeroSection from "@/components/doYouWorkOnIt/HeroSection";
import HowItWorks from "@/components/doYouWorkOnIt/HowItWorks";
import RecentPosts from "@/components/doYouWorkOnIt/RecentPosts";
import Testimonials from "@/components/doYouWorkOnIt/Testimonials";
import TopExperts from "@/components/homeTwo/TopExperts";

function page() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <FixedPriceService />
      <TopExperts />
      <FixedPriceService2 />
      <NewsLetter />
      <SecureGuard />
      <Testimonials />
      <GetWorkersGigs />
      <RecentPosts />
      <GetHelpToday />
    </>
  );
}

export default page;
