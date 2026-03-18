"use client";
import {
  PiArrowUpLeft,
  PiArrowUpRight,
  PiStarFill,
  PiTwitterLogoFill,
} from "react-icons/pi";
import { testimonialData } from "../../data/data";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// Import Swiper React components
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

function Testimonial() {
  return (
    <section className="stp-30 sbp-30 bg-n20">
      <div className="container">
        <Swiper
          modules={[FreeMode, Navigation, Pagination]}
          loop={true}
          autoplay={{
            delay: 3000,
          }}
          spaceBetween={24}
          slidesPerView={"auto"}
          navigation={{
            nextEl: ".ara-next",
            prevEl: ".ara-prev",
          }}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            992: {
              slidesPerView: 2,
              spaceBetween: 100,
            },
          }}
          className="home3-testimonial-carousel"
        >
          <div className="swiper-wrapper">
            {testimonialData
              .filter((_, idx) => idx % 2 === 0)
              .map(({ id, review, img, name, profileId }) => (
                <SwiperSlide
                  className=" flex flex-col items-start justify-start"
                  key={id}
                >
                  <div className="flex items-center justify-start gap-2 text-2xl text-b300">
                    <PiStarFill />
                    <PiStarFill />
                    <PiStarFill />
                    <PiStarFill />
                    <PiStarFill />
                  </div>
                  <p className="pt-6 text-lg font-medium text-n500">{review}</p>
                  <div className="flex items-center justify-start gap-8 pt-8">
                    <div className="flex items-center justify-start gap-4 border-r border-n60 pr-8">
                      <div className="rounded-full bg-n60 p-[2px]">
                        <Image src={img} alt="" className="rounded-full" />
                      </div>
                      <div className="">
                        <p className="heading-5">{name}</p>
                        <p className="font-medium text-n500">{profileId}</p>
                      </div>
                    </div>
                    <div className="text-3xl !leading-none text-b300">
                      <PiTwitterLogoFill />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="swiper-pagination relative mt-16 max-w-[120px] rounded-full bg-white px-2 pt-0.5"></div>
            <div className="flex items-center justify-end gap-3 pt-6 text-2xl !leading-none text-b300 lg:pt-10">
              <button className=" ara-prev flex items-center justify-center rounded-full border border-b300 p-3 duration-500 hover:-rotate-45 hover:bg-b300 hover:text-white lg:p-4">
                <PiArrowUpLeft />
              </button>
              <button className=" ara-next flex items-center justify-center rounded-full border border-b300 p-3 duration-500 hover:rotate-45 hover:bg-b300 hover:text-white lg:p-4">
                <PiArrowUpRight />
              </button>
            </div>
          </div>
        </Swiper>
      </div>
    </section>
  );
}

export default Testimonial;
