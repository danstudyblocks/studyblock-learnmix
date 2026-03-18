"use client";
import Link from "next/link";
import { useState } from "react";
import { PiCaretLeftBold } from "react-icons/pi";

function StepSix() {
  const [active, setActive] = useState(0);
  return (
    <div className="sbp-30 container grid grid-cols-12 pt-20">
      <div className="col-span-12 rounded-2xl border border-n30 p-4 sm:p-10 md:col-span-8 md:col-start-3 xxl:col-span-6 xxl:col-start-4">
        <h4 className="heading-4 flex items-center justify-center gap-2">
          <PiCaretLeftBold /> Set up your account
        </h4>

        <div className="flex flex-col gap-4 pt-6 sm:gap-6 lg:pt-10">
          <div className="">
            <p className="pb-4">First name *</p>
            <input
              type="text"
              className="w-full rounded-xl bg-n30 p-3 outline-none"
            />
          </div>
          <div className="">
            <p className="pb-4">Last name *</p>
            <input
              type="text"
              className="w-full rounded-xl bg-n30 p-3 outline-none"
            />
          </div>
          <div className="">
            <p className="pb-4">Enter your home suburb *</p>
            <input
              type="text"
              className="w-full rounded-xl bg-n30 p-3 outline-none"
            />
          </div>

          <div className="">
            <p className="pb-4">What is your main goal on Servibe? *</p>
            <div className="flex w-full items-center justify-start font-medium max-sm:flex-wrap">
              {["Post Job", "Earn money"].map((item, idx) => (
                <button
                  onClick={() => setActive(idx)}
                  key={idx}
                  className={`rounded-lg ${
                    idx === active ? "bg-n900 text-white" : "bg-n30"
                  } px-10 py-3 duration-500 hover:bg-n900 hover:text-white lg:px-12 flex justify-center items-center gap-2 w-full`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-start gap-3">
            <input type="checkbox" />
            <p className="text-sm text-n300">
              I agree to receive product updates, marketing materials and
              special offers via email, SMS, and push notifications
            </p>
          </div>

          <div className="flex items-center justify-start gap-3">
            <input type="checkbox" />
            <p className="text-sm text-n300">
              I agree to the Servibe
              <Link href="/terms-conditions" className="text-b300">
                Terms & Conditions
              </Link>
              , Community Guidelines, and
              <Link href="/privacy-policy" className="text-b300">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        <div className="w-full pt-10">
          <Link
            href="/sign-in"
            className="relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-2 text-lg font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3"
          >
            <span className="relative z-10">Complete my account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StepSix;
