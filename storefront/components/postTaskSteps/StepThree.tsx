"use client";
import { useState } from "react";
import { PiClipboardBold, PiPaintBrushBroadBold } from "react-icons/pi";

function StepThree() {
  const [active1, setActive1] = useState(0);
  const [active2, setActive2] = useState(0);
  const [active3, setActive3] = useState(0);
  const [active4, setActive4] = useState(0);
  return (
    <>
      <h4 className="heading-4">Provide more details</h4>
      <div className="pt-6 lg:pt-10">
        <p className="pb-4 font-medium text-n300">
          What type of clean do you need?*
        </p>
        <div className="flex flex-wrap items-center justify-start font-medium">
          {["Regular", "End of Lease"].map((item, idx) => (
            <button
              onClick={() => setActive1(idx)}
              key={idx}
              className={`rounded-lg ${
                idx === active1 ? "bg-n900 text-white" : "bg-n30"
              } px-10 py-3 duration-500 hover:bg-n900 hover:text-white lg:px-15 flex justify-center items-center gap-2`}
            >
              <span className="block text-xl leading-none">
                {idx === 0 && <PiPaintBrushBroadBold />}
                {idx === 1 && <PiClipboardBold />}
              </span>
              <span className="block">{item}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="pb-4 pt-6 font-medium text-n300">How many bedrooms?*</p>

      <div className="flex items-center justify-start font-medium max-lg:flex-wrap">
        {["None", "1", "2", "3", "4"].map((item, idx) => (
          <button
            onClick={() => setActive2(idx)}
            key={idx}
            className={`rounded-lg ${
              idx === active2 ? "bg-n900 text-white" : "bg-n30"
            } px-10 py-3 duration-500 hover:bg-n900 hover:text-white lg:px-12 flex justify-center items-center gap-2`}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="pb-4 pt-6 font-medium text-n300">How many rooms?*</p>

      <div className="flex items-center justify-start font-medium max-lg:flex-wrap">
        {["None", "1", "2", "3", "4"].map((item, idx) => (
          <button
            onClick={() => setActive3(idx)}
            key={idx}
            className={`rounded-lg ${
              idx === active3 ? "bg-n900 text-white" : "bg-n30"
            } px-10 py-3 duration-500 hover:bg-n900 hover:text-white lg:px-12 flex justify-center items-center gap-2`}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="pb-4 pt-6 font-medium text-n300">
        Should the cleaner bring equipment and supplies?*
      </p>

      <div className="flex items-center justify-start font-medium max-sm:flex-wrap">
        {["Yes, bring supplies", "No, I will provide"].map((item, idx) => (
          <button
            onClick={() => setActive4(idx)}
            key={idx}
            className={`rounded-lg ${
              idx === active4 ? "bg-n900 text-white" : "bg-n30"
            } px-10 py-3 duration-500 hover:bg-n900 hover:text-white lg:px-12 flex justify-center items-center gap-2 w-full`}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="pt-6 font-medium text-n300">What needs cleaning?*</p>
      <p className="pt-1 text-n300">E.g. carpets vacuumed, oven cleaned</p>
      <textarea className="mt-4 min-h-[130px] w-full rounded-lg bg-n30"></textarea>
    </>
  );
}

export default StepThree;
