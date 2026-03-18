"use client";
import StepFive from "@/components/postTaskSteps/StepFive";
import StepFour from "@/components/postTaskSteps/StepFour";
import StepOne from "@/components/postTaskSteps/StepOne";
import StepSix from "@/components/postTaskSteps/StepSix";
import StepThree from "@/components/postTaskSteps/StepThree";
import StepTwo from "@/components/postTaskSteps/StepTwo";
import logo from "@/public/images/logo.png";
import stepIcon from "@/public/images/steps_icon.png";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PiCheckBold, PiXBold } from "react-icons/pi";

const stepsName = ["Title & Date", "Location", "Details", "Budget"];

function PostsTasksSteps() {
  const [steps, setSteps] = useState(0);

  return (
    <>
      <section className="sbp-30">
        <div className="4xl:large-container flex items-center justify-between pt-6 max-4xl:container">
          <Link href="/">
            <Image src={logo} alt="" />
          </Link>
          <Link
            href="/"
            className="flex items-center justify-start gap-2 text-lg font-medium duration-500 hover:text-r300"
          >
            Cancel{" "}
            <span className="ph-bold ph-x !leading-none">
              {" "}
              <PiXBold />{" "}
            </span>
          </Link>
        </div>

        {steps < 4 && (
          <div className="stp-30 container grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 xl:col-span-3 xl:col-start-2">
              <div className="rounded-3xl border border-n30 p-4 sm:p-8">
                <ul className="flex flex-col gap-8">
                  {stepsName.map((item, idx) => (
                    <li className="relative" key={idx}>
                      {steps === idx ? (
                        <div className="flex w-full items-center justify-start gap-4 rounded-full bg-b50 p-2">
                          <div className="flex items-center justify-center rounded-full bg-b300 p-2 !leading-none text-white">
                            <PiCheckBold />
                          </div>
                          <p className="text-sm font-medium">Title & Date</p>
                        </div>
                      ) : (
                        <div
                          className={`flex w-full items-center justify-start gap-4 rounded-full p-2 ${
                            steps > idx ? "text-b300" : "text-n300"
                          }`}
                        >
                          <div
                            className={`flex size-9 items-center justify-center rounded-full border-2 ${
                              steps > idx ? "border-b300" : "border-n300"
                            } p-2 text-sm !leading-none `}
                          >
                            {idx + 1}
                          </div>
                          <p className="text-sm font-medium ">{item}</p>
                        </div>
                      )}

                      {stepsName.length !== idx + 1 && (
                        <Image
                          src={stepIcon}
                          className="absolute -bottom-7 rtl:right-6 ltr:left-6"
                          alt=""
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-span-12 md:col-span-8 xl:col-span-6 xl:col-start-6">
              <div className="rounded-3xl border border-n30 p-6 sm:p-8">
                {steps === 0 && <StepOne />}
                {steps === 1 && <StepTwo />}
                {steps === 2 && <StepThree />}
                {steps === 3 && <StepFour />}

                <div
                  className={`stp-15 flex items-center ${
                    steps > 0 ? "justify-between gap-6" : "justify-end"
                  }`}
                >
                  {steps > 0 && (
                    <button
                      onClick={() => setSteps(steps - 1)}
                      className="relative flex w-1/2 items-center justify-center overflow-hidden rounded-full bg-n30 px-4 py-2 text-lg font-medium duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3"
                    >
                      <span className="relative z-10">Back</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSteps(steps + 1)}
                    className="relative flex w-1/2 items-center justify-center overflow-hidden rounded-full bg-b300 px-4 py-2 text-lg font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3"
                  >
                    <span className="relative z-10">Next</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {steps === 4 && <StepFive steps={steps} setSteps={setSteps} />}
        {steps === 5 && <StepSix />}
      </section>
    </>
  );
}

export default PostsTasksSteps;
