// Import Swiper styles
import "swiper/css";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, FreeMode } from "swiper/modules";

import { PiQuotesFill } from "react-icons/pi";
import { loginReviewData } from "../../data/data";
import icon from "@/public/images/login_slider_icon.png";
import Image from "next/image";

function LeftSideSlider() {
  return (
    <div className="ml-10 flex items-start justify-start gap-10 max-lg:hidden 3xl:ml-40 3xl:gap-20">
      <Swiper
        modules={[FreeMode, Autoplay]}
        loop={true}
        speed={10000}
        direction={"vertical"}
        autoplay={{
          delay: 1,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },

          700: {
            slidesPerView: 2.2,
          },
        }}
        className=" smooth h-[100vh] max-xl:hidden"
      >
        <div className="swiper-wrapper">
          {loginReviewData.map(({ id, review, img, name }) => (
            <SwiperSlide
              key={id}
              className="swiper-slide relative mt-16 max-w-[320px] bg-white px-8 pb-8"
            >
              <div className="-mt-4">
                <span className="text-4xl !leading-none text-v200">
                  <PiQuotesFill />
                </span>
              </div>
              <p className="stp-15 pb-8 text-n300">{review}</p>
              <div className="flex items-center justify-start gap-3">
                <Image src={img} className="size-12 rounded-full" alt="" />
                <p className="font-semibold">{name}</p>
                <div className="pl-2">
                  <Image src={icon} alt="" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>

      <Swiper
        modules={[FreeMode, Autoplay]}
        loop={true}
        speed={10000}
        direction={"vertical"}
        slidesPerView={"auto"}
        initialSlide={10}
        autoplay={{
          delay: 1,
          reverseDirection: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },

          700: {
            slidesPerView: 2.2,
          },
        }}
        className=" smooth h-[100vh]"
      >
        <div className="swiper-wrapper">
          {loginReviewData.map(({ id, review, img, name }) => (
            <SwiperSlide
              key={id}
              className="swiper-slide relative mt-16 max-w-[320px] bg-white px-8 pb-8"
            >
              <div className="-mt-4">
                <span className="text-4xl !leading-none text-v200">
                  <PiQuotesFill />
                </span>
              </div>
              <p className="stp-15 pb-8 text-n300">{review}</p>
              <div className="flex items-center justify-start gap-3">
                <Image src={img} className="size-12 rounded-full" alt="" />
                <p className="font-semibold">{name}</p>
                <div className="pl-2">
                  <Image src={icon} alt="" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
}

export default LeftSideSlider;
