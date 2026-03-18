"use client";
import Image from "next/image";
import LinkButton from "../ui/LinkButton";
import Counter from "../ui/NumberCounter2";
import aboutImg1 from "@/public/images/about_us_img_1.png";
import aboutImg2 from "@/public/images/about_us_img_2.png";

function AboutSection() {
  return (
    <section className="stp-30 sbp-30">
      <div className="container grid grid-cols-12 max-xl:gap-6">
        <div className="col-span-12 lg:col-span-7 xl:col-span-6">
          <div className="flex items-start justify-start gap-4 sm:gap-8">
            <div className="overflow-hidden rounded-2xl">
              <Image src={aboutImg1} alt="" />
            </div>
            <div className="flex flex-col items-center justify-center md:mt-16 xl:mt-4">
              <div className="display-3 font-extrabold text-b300 flex">
                0
                <Counter value={7} />+
              </div>
              <p className="text-lg font-medium sm:min-w-[200px] xxl:text-xl">
                Years Experience
              </p>
            </div>
          </div>
          <div className="-mt-24 flex items-end justify-end overflow-hidden min-[370px]:-mt-40 sm:-mt-72 md:-mt-80 lg:-mt-52 xl:-mt-64 xxl:-mt-80">
            <Image
              src={aboutImg2}
              alt=""
              className="rounded-2xl max-sm:max-w-[250px] max-[480px]:max-w-[180px] max-[370px]:max-w-[130px]"
            />
          </div>
        </div>

        <div className="col-span-12 flex flex-col items-start justify-center lg:col-span-5 xl:col-start-8">
          <h5 className="heading-5 text-r300">About Us</h5>
          <h2 className="heading-2 max-w-[500px] pt-4">
            Know Our On-Demand Services Platform
          </h2>
          <p className="pb-4 pt-3 text-n300 xl:pb-8">
            Readers are distracted by readable content when viewing page layout.
            This phenomenon has long been recognized in the design and
            publishing industries.
          </p>
          <ul className="ml-4 flex list-disc flex-col gap-3 pb-6 xl:pb-10">
            <li>Readers are distracted by readable content when viewing</li>
            <li>Biodegradable chemicals are used</li>
            <li>Cleaning Tools will be used to remove deep stains</li>
            <li>Complete Sanitization and cleaning of bathroom</li>
          </ul>

          <div className="text-sm text-white">
            <LinkButton link="/contact" text="Know More About" isBlue={true} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
