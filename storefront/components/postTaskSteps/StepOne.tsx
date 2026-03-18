"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const timeSelect = [
  {
    id: uuidv4(),
    time: "Morning",
    hour: "Before 10am",
  },
  {
    id: uuidv4(),
    time: "Morning",
    hour: "After 10am",
  },
  {
    id: uuidv4(),
    time: "Evening",
    hour: "Before 10pm",
  },
  {
    id: uuidv4(),
    time: "Evening",
    hour: "After 10am",
  },
];

function StepOne() {
  const [selectTime, setSelectTime] = useState(0);
  return (
    <div className="">
      <h4 className="heading-4">Let&apos;s start with the basics</h4>
      <p className="pb-4 pt-6 lg:pt-10">
        In a few words, what do you need done?*
      </p>
      <input
        type="text"
        className="w-full rounded-2xl bg-n30 p-3 outline-none"
      />

      <p className="pb-4 pt-6 font-medium text-n300 lg:pt-10">
        When do you need this done?*
      </p>
      <div className="flex flex-wrap items-center justify-start gap-2">
        <div className="">
          <p className="pb-3 font-semibold">On Date</p>
          <input
            type="date"
            className="rounded-full border border-n900 px-4 py-3 outline-none"
          />
        </div>

        <div className="">
          <p className="pb-3 font-semibold">Before Date</p>
          <input
            type="date"
            className="rounded-full border border-n900 px-4 py-3 outline-none"
          />
        </div>

        <div className="">
          <p className="pb-3 font-semibold">Anytime</p>
          <button className="rounded-full border border-n900 bg-n900 px-4 py-3 font-medium text-white">
            I&apos;m flexible
          </button>
        </div>
      </div>

      <div className="flex items-center justify-start gap-2 pb-6 pt-6 font-medium lg:pb-10">
        <input type="checkbox" />
        <p>I need a certain time of day</p>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-3">
        {timeSelect.map(({ id, time, hour }, idx) => (
          <div
            key={id}
            onClick={() => setSelectTime(idx)}
            className={`cursor-pointer rounded-2xl ${
              idx === selectTime ? "bg-n900 text-white" : "bg-n30"
            } px-3 py-3 text-center duration-500 hover:bg-n900 hover:text-white lg:px-5 lg:py-6`}
          >
            <p className="font-semibold">{time}</p>
            <p className="text-sm font-medium">{hour}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StepOne;
