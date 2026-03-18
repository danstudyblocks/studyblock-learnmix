"use client";
import { useState } from "react";
import { PiMapPinBold } from "react-icons/pi";

function StepTwo() {
  const [active, setActive] = useState(0);
  return (
    <div>
      <h4 className="heading-4">Tell us where</h4>
      <div className="pt-6 lg:pt-10">
        <p className="pb-4 font-medium text-n300">
          Is this a home cleaning task?*
        </p>
        <div className="flex items-center justify-start font-medium">
          {["Yes", "No"].map((item, idx) => (
            <button
              onClick={() => setActive(idx)}
              key={idx}
              className={`rounded-lg ${
                idx === active ? "bg-n900 text-white" : "bg-n30"
              } px-10 py-3 duration-500 hover:bg-n900 hover:text-white lg:px-15`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="pb-4 pt-6 font-medium text-n300 lg:pt-10">
        When do you need this done?*
      </p>

      <div className="flex items-center justify-start gap-3 rounded-2xl bg-n30 p-3">
        <PiMapPinBold />
        <input
          type="text"
          className="w-full bg-transparent outline-none placeholder:font-medium placeholder:text-n900"
          placeholder="Enter suburd or postcode"
        />
      </div>
    </div>
  );
}

export default StepTwo;
