"use client";

import bigArrow from "@/public/images/big_arrow.png";
import Image from "next/image";
import Link from "next/link";
import { socialLinks } from "../../../data/data";
import FadeDown from "../../animation/FadeDown";
import LinkButton from "../../ui/LinkButton";

function FooterThree() {
  return (
    <section className="stp-15 overflow-hidden bg-n900">
      <div className="4xl:large-container text-white max-4xl:mx-4">
        <div className="sbp-15 flex items-center justify-between border-b border-n500 max-xl:flex-col max-xl:gap-6">
          <div className="flex w-full items-center justify-start gap-4 max-xl:justify-center">
            <Image
              src={bigArrow}
              alt=""
              className="max-xxl:w-[80px] max-md:w-[60px]"
            />
            <p className="text-xl font-medium sm:text-3xl md:text-5xl 3xl:text-[72px]">
              Let’s work together
            </p>
          </div>

          <div className="flex items-center justify-between gap-6 max-sm:flex-col">
            <div className="rounded-[32px] border px-6 py-10 xxl:px-12 xxl:py-20">
              <p className="heading-3 pb-6 text-center font-bold md:w-[285px] xxl:pb-10">
                Looking to hire an Service?
              </p>
              <div className="flex items-center justify-center font-bold text-n900">
                <LinkButton link="/contact" text="LETS'S TALK" />
              </div>
            </div>
            <div className="rounded-[32px] border px-6 py-10 xxl:px-12 xxl:py-20">
              <p className="heading-3 pb-6 text-center font-bold md:w-[285px] xxl:pb-10">
                Looking to hire an Service?
              </p>
              <div className="flex items-center justify-center font-bold text-n900">
                <LinkButton link="/sign-up" text="JOIN US" />
              </div>
            </div>
          </div>
        </div>

        <div className="stp-15 flex items-center justify-between gap-6 max-md:flex-col max-[450px]:items-start">
          <div className="flex items-center justify-start gap-6 font-medium max-sm:items-start max-[450px]:flex-col">
            <p className="max-w-[200px] text-start lg:max-w-[250px]">
              Valentin, Street Road 27, New York. USA - 752252
            </p>
            <div className="lg:pl-15">
              <p className="font-semibold">(629) 555-0129</p>
              <p>example@mail.com</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-2xl">
            {socialLinks.slice(0, 4).map(({ id, icon, link }) => (
              <Link key={id} className="group relative" href={link}>
                <span className=" flex items-center justify-center rounded-full border border-n500 p-4 duration-500 hover:border-v200 hover:text-v200">
                  {icon}
                </span>

                <div className="absolute right-1/2 top-1 h-0 w-px bg-v200 duration-500 group-hover:h-2"></div>
                <div className="absolute right-1 top-1/2 h-px w-0 bg-v200 duration-500 group-hover:w-2"></div>

                <div className="absolute bottom-1 right-1/2 h-0 w-px bg-v200 duration-500 group-hover:h-2"></div>

                <div className="absolute left-1 top-1/2 h-px w-0 bg-v200 duration-500 group-hover:w-2"></div>
              </Link>
            ))}
          </div>
        </div>

        <FadeDown>
          <h1 className="text-center text-[430px] font-bold leading-none max-4xl:text-[400px] max-3xl:text-[350px] max-xxl:text-[300px] max-xl:text-[230px] max-lg:text-[180px] max-md:text-[130px] max-sm:text-[70px]">
            Servibe
          </h1>
        </FadeDown>

        <div className="border-t border-n500">
          <div className="container flex items-center justify-between gap-6 py-8 font-medium max-md:flex-col">
            <div className="flex items-center justify-start gap-1">
              <p>Designed By</p>
              <Link href="" className="text-g200 underline">
                Pixelaxis
              </Link>
            </div>

            <p>Copyright @ {new Date().getFullYear()} Servibe</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FooterThree;
