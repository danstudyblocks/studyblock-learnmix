"use client";

import illus from "@/public/images/home-four-illus.png";
import testimonialImg from "@/public/images/testimonial_img.png";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// Import Swiper React components
import Image from "next/image";
import { PiArrowUpLeft, PiArrowUpRight } from "react-icons/pi";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { testimonialData } from "../../data/data";

function Testimonial() {
  return (
    <section className="stp-30 sbp-30 relative overflow-hidden bg-b50">
      <div className="absolute right-0 top-0">
        <Image
          src={illus}
          alt=""
          className="max-[1860px]:w-[280px] max-3xl:w-[150px] max-xl:hidden"
        />
      </div>
      <div className="container">
        <div className="sbp-15 flex items-center justify-between gap-6 border-b border-sp max-sm:flex-col">
          <div className="">
            <h5 className="heading-5 text-r300">Testimonials</h5>
            <h2 className="heading-2 max-w-[500px] pt-4">
              What Users Are Saying About The Servibe
            </h2>
          </div>
          <p className="font-medium text-n500 sm:max-w-[300px]">
            Incredibly impressed on-demand cleaning service. Prompt, thorough
            and left home sparkling.
          </p>
        </div>

        <div className="grid grid-cols-12 max-lg:gap-6">
          <div className="stp-15 col-span-12 flex items-center justify-center border-sp pr-6 md:col-span-4 md:border-r lg:col-span-5 lg:pr-20">
            <Image
              src={testimonialImg}
              alt=""
              className="max-md:max-h-[300px]"
            />
          </div>

          <div className="col-span-12 flex items-center justify-start md:col-span-7 lg:col-span-6 lg:col-start-7">
            <Swiper
              modules={[FreeMode, Navigation]}
              loop={true}
              autoplay={{
                delay: 3000,
              }}
              navigation={{
                nextEl: ".ara-next",
                prevEl: ".ara-prev",
              }}
              slidesPerView={"auto"}
              className=" md:max-lg:pt-6"
            >
              <div className="swiper-wrapper">
                {testimonialData.map(({ id, review, name }) => (
                  <SwiperSlide key={id} className="swiper-slide w-full">
                    <p className="border-b border-sp pb-5 text-lg font-medium text-n500 sm:text-xl">
                      {review}
                    </p>

                    <h4 className="heading-4 pt-5">{name}</h4>
                    <p className="pt-1 font-medium text-n500">
                      VP of Marketing
                    </p>
                  </SwiperSlide>
                ))}
              </div>
              <div className="flex items-center justify-start gap-3 pt-6 text-2xl !leading-none text-b300 lg:pt-10">
                <button className="ara-prev flex items-center justify-center rounded-full border border-b300 p-3 duration-500 hover:-rotate-45 hover:bg-b300 hover:text-white lg:p-4">
                  <PiArrowUpLeft />
                </button>
                <button className="ara-next flex items-center justify-center rounded-full border border-b300 p-3 duration-500 hover:rotate-45 hover:bg-b300 hover:text-white lg:p-4">
                  <PiArrowUpRight />
                </button>
              </div>
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
