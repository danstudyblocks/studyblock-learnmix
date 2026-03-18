"use client";
import { useState } from "react";
import AnimateHeight from "react-animate-height";
import { PiCaretRight, PiQuestionFill } from "react-icons/pi";
import { faqData } from "../../data/data";
import Link from "next/link";

function FaqSection() {
  const [show, setShow] = useState(0);
  return (
    <section id="faq" className="stp-30 sbp-30">
      <div className="container grid grid-cols-12 gap-6 xl:gap-10">
        <div className="col-span-12 rounded-3xl border border-n40 p-4 sm:px-10 sm:py-9 lg:col-span-5">
          <p className="heading-6 text-b300">FAQ</p>
          <h2 className="heading-2 pb-4 pt-3 xl:pb-6">
            Your questions <span className="text-b300">answered.</span>
          </h2>
          <p className="pb-6 font-medium text-n400 xl:pb-10">
            Let’s do our best to answer your most frequently asked questions.
          </p>
          <div className="mb-6 rounded-3xl border border-n40 p-4 sm:p-6">
            <div className="flex items-center justify-start gap-3">
              <div className="flex items-center justify-center rounded-2xl border border-n40 p-3 text-b300 sm:p-5">
                <span className="text-4xl">
                  <PiQuestionFill />
                </span>
              </div>
              <div className="">
                <h5 className="heading-5">Still have questions?</h5>
                <p className="pt-3">
                  Can’t find the answer you’re looking for?Please chat to our
                  friendly team!
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/contact"
            className="relative flex items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] sm:px-8"
          >
            <span className="relative z-10">Gen In Touch</span>
          </Link>
        </div>

        <div className="col-span-12 flex flex-col items-start justify-center gap-6 rounded-3xl border border-n40 p-4 sm:p-10 lg:col-span-7">
          {faqData.map(({ id, question, answer }, idx) => (
            <div
              key={id}
              className=" overflow-hidden rounded-2xl border border-n40 px-4 py-3 w-full cursor-pointer"
              onClick={() => setShow(idx === show ? NaN : idx)}
            >
              <div className="flex items-center justify-between max-sm:gap-2">
                <p className=" text-base font-medium sm:text-lg">{question}</p>
                <div
                  className={`flex items-center justify-center rounded-full bg-b300 p-2 text-xl !leading-none text-white duration-700 sm:p-3 ${
                    show === idx ? "rotate-90" : "rotate-0"
                  }`}
                >
                  <PiCaretRight />
                </div>
              </div>
              <AnimateHeight height={show === idx ? "auto" : 0}>
                <p className="pr-8 pt-3 text-n400">{answer}</p>
              </AnimateHeight>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
