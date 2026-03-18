import { PiArrowCircleRightThin, PiArrowRightBold } from "react-icons/pi";
import { exploreCategory } from "../../data/data";
import StaggerEffectTwo from "../animation/StaggerEffectTwo";
import Image from "next/image";
import Link from "next/link";

function ExploreCategory() {
  return (
    <section className="stp-30 sbp-30 bg-n10">
      <div className="container">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="max-sm:heading-4 sm:heading-2 font-bold text-n900">
              Explore by <span className="text-b300 underline">Category</span>
            </h2>
          </div>
          <div className="">
            <Link
              href="/services"
              className="flex items-center justify-start gap-3 font-bold duration-300 hover:text-b300"
            >
              Show All Services
              <span className="text-2xl !leading-none">
                <PiArrowRightBold />
              </span>
            </Link>
          </div>
        </div>

        <div className="stp-15 grid grid-cols-12 gap-6">
          {exploreCategory.map(
            ({ id, name, desc, icon, bgColor, iconBgColor }, idx) => (
              <div className="col-span-12 sm:col-span-6 lg:col-span-4" key={id}>
                <StaggerEffectTwo id={idx}>
                  <div
                    className={` flex flex-col items-center justify-center rounded-xl ${bgColor} p-4  xl:p-8`}
                  >
                    <div className={`rounded-full ${iconBgColor} p-5`}>
                      <Image src={icon} className="" alt="" />
                    </div>
                    <h4 className="heading-3 pb-3 pt-5">{name}</h4>
                    <p className="pb-6 text-center font-medium text-n500 xl:pb-8">
                      {desc}
                    </p>
                    <div className="flex w-full items-center justify-between">
                      <p className="font-semibold max-[350px]:max-w-[100px] sm:max-md:max-w-[100px]">
                        45 Services Available
                      </p>
                      <Link
                        href="/services"
                        className="group relative cursor-pointer text-5xl !leading-none text-n900"
                      >
                        <div className="absolute right-7 top-[23px] z-10 h-0.5 rtl:w-10 ltr:w-16 bg-n900 duration-700 group-hover:w-0"></div>
                        <div
                          className={`absolute right-7 top-[18px] h-3 rtl:w-10 ltr:w-16 ${bgColor} duration-700 group-hover:w-0`}
                        ></div>
                        <PiArrowCircleRightThin />
                      </Link>
                    </div>
                  </div>
                </StaggerEffectTwo>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default ExploreCategory;
