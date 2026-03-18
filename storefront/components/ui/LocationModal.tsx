"use client";

import { useState } from "react";
import { PiMapPin } from "react-icons/pi";
import { city_names } from "../../data/countryCity";
import useClickOutside from "../../hooks/useClickOutside";

function LocationModal() {
  const { modal, setModal, modalRef } = useClickOutside();

  const [location, setLocation] = useState<null | string>(null);
  return (
    <div className="relative border-r px-4 sm:pr-10">
      <div
        className="flex cursor-pointer items-center justify-between gap-2"
        onClick={() => setModal((prev) => !prev)}
      >
        {/* <PiMapPin /> */}
        <span className="locationText text-lg">
          Subject
        </span>
      </div>

      <div
        className={`absolute rtl:right-0 ltr:left-0 top-10 w-[150px] origin-top rounded-3xl border border-n30 bg-white py-3 text-base duration-700 max-sm:text-sm sm:-left-8 sm:w-[200px] sm:py-5 max-h-[300px] overflow-y-auto overflow-x-hidden ${
          modal
            ? "visible scale-100 opacity-100"
            : "invisible scale-0 opacity-0"
        }`}
        ref={modalRef}
      >
        <input
          type="text"
          className="mx-2 w-[90%] rounded-xl border border-n30 px-2 py-2 outline-none placeholder:text-n800 sm:mx-3 sm:px-3"
          placeholder="Search"
        />
        {city_names.map((item, idx) => (
          <p
            onClick={() => {
              setLocation(item);
              setModal(false);
            }}
            key={idx}
            className="locationItem cursor-pointer px-6 py-2 duration-500 hover:bg-b300 hover:text-white text-start"
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export default LocationModal;
