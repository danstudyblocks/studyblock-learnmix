"use client";
import Image from "next/image";
import { PiQuotesFill, PiStarFill } from "react-icons/pi";
import { testimonialData } from "../../data/data";
import NumberCounter from "../ui/NumberCounter";

function Testimonial() {
  return (
    <section className="stp-30 sbp-30 bg-n20">
      <div className="container">
        <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start sm:max-lg:pb-10">
          <div className="relative flex items-center justify-start gap-4 max-sm:mb-16 lg:gap-20">
            <p className="text-7xl font-extrabold text-b300 sm:text-[100px] lg:text-[180px]">
              4.9
            </p>
            <div className="flex items-center justify-start text-2xl text-y600 max-lg:-mt-8 lg:pb-12">
              <PiStarFill />
              <PiStarFill />
              <PiStarFill />
              <PiStarFill />
              <PiStarFill />
            </div>

            <div className="box-shadow-3 absolute -bottom-12 flex items-center justify-start gap-3 rounded-r-3xl rounded-bl-3xl border border-b10 bg-b50 px-8 py-3 sm:-bottom-12 sm:left-32 sm:right-0 sm:w-[250px] lg:-bottom-2 lg:left-64 lg:px-8 lg:py-5 xl:w-[300px]">
              <p className="heading-3 flex items-center justify-start font-bold">
                <span className="w-[80px]">
                  <NumberCounter start={1} end={1453} />
                </span>
                +
              </p>
              <p className="max-w-[50px] font-medium text-n400 sm:mt-8 sm:max-w-[82px]">
                Google Reviews
              </p>
            </div>
          </div>

          <h2 className="heading-2 sm:max-w-[200px] lg:max-w-[240px]">
            Our Customers love us
          </h2>
        </div>

        <div className="stp-15 grid grid-cols-12 gap-6">
          {testimonialData
            .slice(0, 3)
            .map(({ id, review, img, name, profileId }, idx) => (
              <div
                className={`col-span-12 flex flex-col gap-6 rounded-xl border ${
                  idx == 0
                    ? "border-n40 bg-r50"
                    : idx == 1
                    ? "border-n40 bg-bg1"
                    : "border-n40 bg-bg2"
                } p-6 md:col-span-6 lg:col-span-4 xl:gap-10 xl:p-10`}
                key={id}
              >
                <div className="flex flex-col justify-start">
                  <span className="w-[40px] rotate-180 text-4xl">
                    <PiQuotesFill />
                  </span>
                  <div className="flex items-center justify-start gap-1 pt-5 text-xl text-y600">
                    <PiStarFill />
                    <PiStarFill />
                    <PiStarFill />
                    <PiStarFill />
                    <PiStarFill />
                  </div>
                </div>
                <p className="text-lg text-n400">{review.slice(0, 150)}</p>
                <div className="flex items-center justify-start gap-4">
                  <div className="">
                    <Image src={img} alt="" className="rounded-full" />
                  </div>
                  <div className="">
                    <p className="heading-5">{name}</p>
                    <p className="font-medium text-n500">{profileId}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
