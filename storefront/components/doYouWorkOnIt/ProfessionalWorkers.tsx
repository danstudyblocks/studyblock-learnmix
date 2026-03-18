"use client";
import { useState } from "react";
import { popularTabNames, topExperts } from "../../data/data";
// Import Swiper styles
import "swiper/css";
import "swiper/css/scrollbar";
// Import Swiper React components
import { FreeMode, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import reviewImg from "@/public/images/review_img.png";
import verifyBadge from "@/public/images/verify-badge.png";
import Image from "next/image";
import Link from "next/link";
import {
  PiChartLine,
  PiChat,
  PiClock,
  PiHeartStraight,
  PiStarFill,
} from "react-icons/pi";

function ProfessionalWorkers() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="grid grid-cols-4 gap-3 !text-xs">
      {topExperts
        .map(({ id, img, expertName, location }) => (
          <div className="rounded-xl border p-4" key={id}>
            <div className="flex items-start justify-between">
              <p className="rounded-full bg-y300 px-2 py-1 text-xs font-medium">
                PRO
              </p>
              <div className="">
                <div className="">
                  <Image src={reviewImg} alt="" />
                </div>
                <div className="flex gap-2 pt-2">
                  <p className="flex items-center justify-start gap-2 text-xl font-bold !leading-none text-o300">
                    <PiStarFill /> 4.4
                  </p>
                  <div className="text-xs text-n300">
                    <p className="font-semibold">Overall rating</p>
                    <p className="">818 ratings</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative max-md:overflow-hidden">
                <div className="hexagon-styles my-[calc(134px*0.5/2)] h-[calc(134px*0.57736720554273)] w-[134px] rounded-[calc(134px/36.75)] bg-b50 before:rounded-[calc(134px/18.75)] after:rounded-[calc(134px/18.75)]">
                  <div className="absolute -top-[27px] left-[5px]">
                    <div className="hexagon-styles z-10 my-[calc(124px*0.5/2)] h-[calc(124px*0.57736720554273)] w-[124px] rounded-[calc(124px/50)] bg-b300 before:rounded-[calc(124px/50)] after:rounded-[calc(124px/50)]">
                      <div className="absolute -top-[26px] left-[4px] z-20">
                        <div className="hexagon-styles z-10 my-[calc(116px*0.5/2)] h-[calc(116px*0.57736720554273)] w-[116px] rounded-[calc(116px/50)] bg-b50 before:rounded-[calc(116px/50)] after:rounded-[calc(116px/50)]">
                          <div className="r-hex3 absolute -left-0.5 -top-[26px] z-30 inline-block w-[120px] overflow-hidden">
                            <div className="r-hex-inner3">
                              <div
                                className={`${img} r-hex-inner-3 before:h-[120px] before:bg-cover`}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-5 right-1 z-30">
                  <Image src={verifyBadge} alt="" className="" />
                </div>
              </div>
              <div className="pt-3">
                <div className="flex flex-col items-center justify-start gap-3">
                  <Link
                    href={`/find-workers/${expertName
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                    className="heading-5"
                  >
                    {expertName}
                  </Link>
                </div>
                <p className="pt-2 text-n500">{location}</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-b border-b50 pb-6">
              <div className="flex items-center justify-start gap-2">
                <span className="ph ph-clock text-2xl !leading-none">
                  <PiClock />
                </span>
                <p>Full-Time</p>
              </div>
              <div className="flex items-center justify-start gap-2">
                <span className="ph ph-chart-line text-2xl !leading-none">
                  <PiChartLine />
                </span>
                <p>10+ Years</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6">
              <p className="heading-6">
                <span className="text-n300">Per Hr:</span> $70
              </p>
              <div className="flex items-end justify-end gap-3">
                <div className="flex items-center justify-center rounded-full border border-n500 p-3 text-lg !leading-none">
                  <PiChat />
                </div>
                <div className="flex items-center justify-center rounded-full border border-n500 p-3 text-lg !leading-none">
                  <PiHeartStraight />
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default ProfessionalWorkers;
