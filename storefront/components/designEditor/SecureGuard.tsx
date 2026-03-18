"use client";

import reviewImg from "@/public/images/safe_guard_review_img.png";
import sbdesignerImg from "@/public/studyblock/sbdesigner.png";
import Image from "next/image";
import Link from "next/link";
import {
  PiCheckCircle,
  PiCurrencyDollarSimple,
  PiShieldCheck,
  PiStar,
  PiStarFill,
  PiThumbsUp,
} from "react-icons/pi";
import LinkButton from "../ui/LinkButton";

function SecureGuard({ isBgGray }: { isBgGray?: boolean }) {
  return (
    <section className={`stp-30 sbp-30 ${isBgGray && "bg-n20"}`}>
      <div className="container grid grid-cols-12 max-lg:gap-6">
        <div className="col-span-12 lg:col-span-4">
          <h5 className="heading-5 text-r300">StudyBlocks Designer</h5>
          <h2 className="heading-2 max-w-[550px] pt-4">
            Create engaging resources in minutes.
          </h2>
          <ul className="flex flex-col gap-8 pt-6 lg:pt-10">
            <li className="relative flex items-start justify-start gap-4">
              <div className="flex items-center justify-center rounded-full bg-b300 p-3 text-2xl !leading-none text-white">
                <PiCurrencyDollarSimple />
                <div className="linear_gradient_one absolute bottom-3 rtl:right-6 ltr:left-6 h-[50px] w-[2px]"></div>
              </div>
              <div className="">
                <h5 className="heading-5">Thousands of teacher approved learning resources</h5>
                <p className="max-w-[500px] py-3 text-sbtext">
                  Make our resources your own with the StudyBlocks designer tool.
                  Edit the text, colour, images and add your logo in seconds.
                </p>
              </div>
            </li>
            <li className="relative flex items-start justify-start gap-4">
              <div className="flex items-center justify-center rounded-full bg-b300 p-3 text-2xl !leading-none text-white">
                <PiStar />
                <div className="linear_gradient_one absolute bottom-3 rtl:right-6 ltr:left-6 h-[50px] w-[2px]"></div>
              </div>
              <div className="">
                <h5 className="heading-5">Differentiate content with a click</h5>
                <p className="max-w-[500px] py-3 text-sbtext">
                  Our AI tool quickly adapts content to meet all student needs,
                  allowing on-demand customisation.
                </p>
              </div>
            </li>
            <li className="relative flex items-start justify-start gap-4">
              <div className="flex items-center justify-center rounded-full bg-b300 p-3 text-2xl !leading-none text-white">
                <PiShieldCheck />
                <div className="linear_gradient_one absolute bottom-3 rtl:right-6 ltr:left-6 h-[50px] w-[2px]"></div>
              </div>
              <div className="">
                <h5 className="heading-5">Create, share and sell</h5>
                <p className="max-w-[500px] py-3 text-sbtext">
                  Effortlessly upload your new learning resource to the
                  StudyBlocks marketplace with a single click. Save time
                  for fellow teachers and earn money by sharing your expertise.
                </p>
              </div>
            </li>
          </ul>
          <div className="flex justify-start pt-10 text-white">
            <LinkButton link="/post-task" text="Join the waiting list today" isBlue={true} />
          </div>
        </div>

        <div className="col-span-12 flex items-center justify-center lg:col-span-7 lg:col-start-6">
            <Image
              src={sbdesignerImg}
              alt="designer"
              className="w-full"
            />
        </div>
      </div>
    </section>
  );
}

export default SecureGuard;