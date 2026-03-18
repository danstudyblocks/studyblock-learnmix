"use client";
import { useState } from "react";
import { PiCaretDown } from "react-icons/pi";
import useClickOutside from "../../../hooks/useClickOutside";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "App",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function ChartMonthModal() {
  const { modal, setModal, modalRef } = useClickOutside();
  const [selectedMonth, setSelectedMonth] = useState("May");
  return (
    <div
      className="relative flex cursor-pointer items-center justify-center gap-2 rounded-full border border-n40 bg-n10 px-4 py-2 text-sm font-medium text-n300"
      onClick={() => setModal((prev) => !prev)}
      ref={modalRef}
    >
      <p>{selectedMonth}</p>
      <PiCaretDown />
      <div
        className={`absolute right-0 top-9 z-10 max-h-32 w-full origin-top-right overflow-y-auto rounded-xl border border-n30 bg-white p-3 duration-500 ${
          modal
            ? "visible scale-100 opacity-100"
            : "invisible scale-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-3">
          {monthNames.map((item, idx) => (
            <li
              onClick={() => setSelectedMonth(item)}
              key={idx}
              className="cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChartMonthModal;
