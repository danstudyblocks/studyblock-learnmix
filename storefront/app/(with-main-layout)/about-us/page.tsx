import AboutSection from "@/components/aboutUs/AboutSection";
import BreadCrumb from "@/components/aboutUs/BreadCrumb";
import FaqSection from "@/components/aboutUs/FaqSection";
import HowServibeWork from "@/components/aboutUs/HowServibeWork";
import Testimonial from "@/components/homeTwo/Testimonial";
import TopExperts from "@/components/homeTwo/TopExperts";


function page() {
  return (
    <>
      <BreadCrumb />
      <AboutSection />
      <HowServibeWork />
      <TopExperts />
      <Testimonial />
      <FaqSection />
    </>
  );
}

export default page;
