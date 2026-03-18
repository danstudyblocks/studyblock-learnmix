"use client";

import {
  PiCalendarCheck,
  PiCreditCard,
  PiCurrencyCircleDollar,
} from "react-icons/pi";
import FadeRight from "../animation/FadeRight";
import LinkButton from "../ui/LinkButton";
import contactImg from "@/public/studyblock/vocabulary.png";
import aitools from "@/public/studyblock/aitools.png";
import Image from "next/image";

function FixedPriceService2({ isBgWhite }: { isBgWhite?: boolean }) {
  return (
    <section className={`stp-30 sbp-30 ${isBgWhite ? "" : "bg-n20"}`}>
      <div className="container grid grid-cols-12 max-lg:gap-6">
        <div className="relative col-span-12 lg:col-span-6">
          <div className="overflow-hidden pb-6 pl-6">
            <Image
              src={contactImg}
              alt=""
              className="relative z-10 overflow-hidden rounded-2xl"
            />
          </div>
          <div className="absolute bottom-0 left-0 h-[250px] w-[200px] rounded-2xl bg-n900 sm:h-[300px] lg:w-[300px] xl:h-[600px]"></div>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:col-start-8 flex flex-col items-start justify-center max-xxl:overflow-hidden">
          <FadeRight>
            <h5 className="heading-5 pb-4 text-sbhtext">Save time with Free Ai tools.</h5>
            {/* <ul className="flex flex-wrap items-center justify-start gap-3">
              <li className="flex items-center justify-start gap-2">
                <PiCurrencyCircleDollar className="text-xl !leading-none" />
                See your price.
              </li>
              <li className="flex items-center justify-start gap-2">
                <PiCalendarCheck className="text-xl !leading-none" />
                Book a time.
              </li>
              <li className="flex items-center justify-start gap-2">
                <PiCreditCard className="text-xl !leading-none" />
                Pay online.
              </li>
            </ul> */}

            <div className="flex items-center">
              <div>
                <h2 className="heading-2 max-w-[350px] pt-6 font-bold sm:pt-8">
                  Introducing Studyblocks AI tools
                </h2>
              </div>
              <div>
                <Image
                  src={aitools}
                  alt=""
                  className="max-w-[48px] sm:max-w-[110px]"
                />
              </div>
            </div>
            <p className="pt-4 font-medium text-n500">
              Our new AI tools have been carefully crafted with teachers
              to save you time. Generate new content, plan a lesson,
              proofread and rewrite your content all in seconds and
              for free with StudyBlocks AI.
            </p>
            <div className="flex flex-row flex-wrap gap-2 px-6 text-lg my-5 lg:my-10">
              <p className="text-n800 font-bold">
                Popular:
              </p>
              <p className="rounded-xl bg-r50 px-2 py-1 font-medium text-r300">
                Postcard
              </p>
              <p className="rounded-xl bg-g50 px-2 py-1 font-medium text-g400">
                Achievement
              </p>
              <p className="rounded-xl bg-g50 px-2 py-1 font-medium text-r300">
                Books
              </p>
            </div>
            <div className="">
              <LinkButton link="/contact" text="Learn more" />
            </div>
          </FadeRight>
        </div>
      </div>
    </section>
  );
}

export default FixedPriceService2;
