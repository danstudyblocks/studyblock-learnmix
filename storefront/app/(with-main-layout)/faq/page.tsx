import FaqSection from "@/components/aboutUs/FaqSection";
import BreadCrumb2 from "@/components/global/BreadCrumb2";

function page() {
  return (
    <>
      <BreadCrumb2 pageName="FAQ Page" />

      <section className="">
        <div className="container -mt-40 rounded-xl bg-white p-2 sm:p-4 md:rounded-3xl xl:rounded-[60px] xl:p-15">
          <FaqSection />
        </div>
      </section>
    </>
  );
}

export default page;
