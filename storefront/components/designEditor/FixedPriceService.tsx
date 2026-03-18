"use client";

import posterImg from "@/public/images/fixed_price_service_img.png";
import earningLine from "@/public/images/total_earnings_line.png";
import Image from "next/image";
import {
  PiArrowUp,
  PiBellSimpleRingingBold,
  PiCheckCircle,
} from "react-icons/pi";
import FadeLeft from "../animation/FadeLeft";
import LinkButton from "../ui/LinkButton";

function FixedPriceService() {
  return (
    <section className="stp-30 sbp-30 bg-n20">
      <div className="container grid grid-cols-12 max-lg:gap-8 max-sm:gap-6">
        <div className=" max-xxl:overflow-hidden col-span-12 flex flex-col items-start justify-center lg:col-span-5">
          <FadeLeft>
            <h5 className="pb-4 font-bold text-r300">Fixed Price Service</h5>
            <h2 className="heading-2 font-bold text-n900">
              Be your own <span className="text-b300 underline">boss</span>
            </h2>
            <p className="pb-6 pt-3 sm:pb-8">
              Whether you&apos;re a genius spreadsheet guru or a diligent
              carpenter, find your next job on Airtasker.
            </p>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center justify-start gap-2">
                <PiCheckCircle className="text-2xl text-b300" />
                <span>Free access to thousands of job opportunities</span>
              </li>
              <li className="flex items-center justify-start gap-2">
                <PiCheckCircle className="text-2xl text-b300" />

                <span>Grow your business and client base</span>
              </li>
              <li className="flex items-center justify-start gap-2">
                <PiCheckCircle className="text-2xl text-b300" />

                <span>Earn extra income on a flexible schedule</span>
              </li>
              <li className="flex items-center justify-start gap-2">
                <PiCheckCircle className="text-2xl text-b300" />

                <span>No subscription or credit fees</span>
              </li>
            </ul>
            <div className="pt-6 lg:pt-10 flex justify-start items-start">
              <LinkButton link="/sign-up" text="Earn money all" />
            </div>
          </FadeLeft>
        </div>
        <div className="relative col-span-12 flex items-center justify-center sm:py-12 lg:col-span-7">
          <div className="overflow-hidden rounded-xl">
            <Image src={posterImg} alt="" />
          </div>

          <div className="box-shadow-1 3xl:-right-14 absolute right-0 top-0 overflow-hidden rounded-2xl border border-b50 bg-white pb-5 max-sm:hidden">
            <p className="bg-n10 px-6 py-3 font-semibold">Payment received!</p>
            <div className="flex items-center justify-between gap-6 px-6 pt-5 sm:gap-28">
              <div className="">
                <p className="font-medium">Cleaning services</p>
                <p className="text-sm text-n500">2h Ago</p>
              </div>
              <p className="heading-4 pb-1 font-bold">$145</p>
            </div>
          </div>

          <div className="3xl:-right-14 absolute right-0 top-36 max-sm:hidden">
            <p className="box-shadow-2 flex items-center justify-center gap-2 rounded-full bg-g100 px-8 py-3 font-medium">
              <PiBellSimpleRingingBold className="text-xl" /> New job alert!
            </p>
          </div>

          <div className="box-shadow-1 absolute bottom-0 left-0 overflow-hidden rounded-2xl border border-b50 bg-white pb-5 max-sm:hidden">
            <p className="bg-n10 px-6 py-3 font-semibold">Total earnings</p>
            <div className="px-6">
              <div className="py-5">
                <Image
                  src={earningLine}
                  alt=""
                  className="w-full max-sm:max-h-[50px]"
                />
              </div>
              <p className="heading-4 pb-1 font-bold">$14,500</p>
              <p>
                <PiArrowUp className="text-xl text-b300" /> 20% us last month
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FixedPriceService;
