"use client";
import {
  PiArrowsCounterClockwise,
  PiCaretLeft,
  PiCaretRight,
  PiCheck,
  PiEyeFill,
  PiNotePencil,
  PiPencilSimple,
  PiStarFill,
  PiTrash,
  PiX,
} from "react-icons/pi";
import { profileServicesData } from "@/data/data";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

function DashboardServicesPage() {
  const daysTagRef = useRef<HTMLUListElement>(null);
  const currentDateRef = useRef<HTMLParagraphElement>(null);
  const [currYear, setCurrYear] = useState<number>(new Date().getFullYear());
  const [currMonth, setCurrMonth] = useState<number>(new Date().getMonth());

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    renderCalendar();
  }, [currMonth, currYear]);

  const renderCalendar = () => {
    const date = new Date(currYear, currMonth, 1);
    const firstDayOfMonth = date.getDay();
    const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const lastDayOfMonth = new Date(
      currYear,
      currMonth,
      lastDateOfMonth
    ).getDay();
    const lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();

    let liTag: string = "";

    for (let i = firstDayOfMonth; i > 0; i--) {
      liTag += `<li className="inactive">${lastDateOfLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
      const isToday: string =
        i === new Date().getDate() &&
        currMonth === new Date().getMonth() &&
        currYear === new Date().getFullYear()
          ? "active"
          : "";
      liTag += `<li className="${isToday}">${i}</li>`;
    }

    for (let i = lastDayOfMonth; i < 6; i++) {
      liTag += `<li className="inactive">${i - lastDayOfMonth + 1}</li>`;
    }

    if (currentDateRef.current) {
      currentDateRef.current.innerText = `${months[currMonth]} ${currYear}`;
    }
    if (daysTagRef.current) {
      daysTagRef.current.innerHTML = liTag;
    }
  };

  const handleIconClick = (direction: string) => {
    if (direction === "prev") {
      setCurrMonth(currMonth - 1);
      if (currMonth === 0) {
        setCurrYear(currYear - 1);
      }
    } else {
      setCurrMonth(currMonth + 1);
      if (currMonth === 11) {
        setCurrYear(currYear + 1);
      }
    }
  };

  return (
    <section className="mt-[100px] pt-15">
      <div className="4xl:large-container grid grid-cols-12 gap-6 max-4xl:px-4">
        <div className="col-span-12 flex flex-col gap-6 xl:col-span-8 3xl:col-span-9">
          {profileServicesData.map(
            ({
              id,
              title,
              img,
              startingPrice,
              ratingCount,
              viewCount,
              inQ,
              completed,
              cancelled,
            }) => (
              <div
                key={id}
                className="flex w-full items-center justify-between gap-6 rounded-2xl bg-white p-3 max-lg:flex-col"
              >
                <div className="flex items-center justify-start gap-6 max-md:flex-col xl:max-3xl:flex-col">
                  <div className="">
                    <Image src={img} className="rounded-xl" alt="" />
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-start gap-8">
                      <div className="flex items-center justify-start gap-2">
                        <span className="ph-fill ph-star text-2xl text-y300">
                          <PiStarFill />
                        </span>
                        <p className="font-medium text-n300">
                          4.7 ({ratingCount})
                        </p>
                      </div>
                      <div className="flex items-center justify-start gap-2">
                        <span className="ph-fill ph-eye text-2xl text-b300">
                          <PiEyeFill />
                        </span>
                        <p className="font-medium text-n300">{viewCount}</p>
                      </div>
                    </div>
                    <h4 className="heading-4">{title}</h4>
                    <div className="flex items-center justify-start gap-4 max-sm:flex-wrap">
                      <div className="flex items-center justify-center gap-3 rounded-lg bg-b50 px-3 py-3 xl:px-6">
                        <div className="flex items-center justify-center rounded-full bg-b300 p-3 !leading-none text-white">
                          <PiArrowsCounterClockwise />
                        </div>
                        <div className="">
                          <p className="text-xl font-semibold">{inQ}</p>
                          <p className="font-medium">Queue</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-3 rounded-lg bg-y50 px-3 py-3 xl:px-6">
                        <div className="flex items-center justify-center rounded-full bg-y300 p-3 !leading-none text-white">
                          <PiCheck />
                        </div>
                        <div className="">
                          <p className="text-xl font-semibold">{completed}</p>
                          <p className="font-medium">Completed</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-3 rounded-lg bg-r50 px-3 py-3 xl:px-6">
                        <div className="flex items-center justify-center rounded-full bg-r300 p-3 !leading-none text-white">
                          <PiX />
                        </div>
                        <div className="">
                          <p className="text-xl font-semibold">{cancelled}</p>
                          <p className="font-medium">Cancelled</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-6 max-md:flex-wrap 3xl:gap-16">
                  <div className="flex items-center text-center max-lg:gap-4 max-sm:flex-wrap lg:flex-col">
                    <p className="text-lg font-semibold">Starting From:</p>
                    <p className="text-2xl font-bold text-r300 lg:pb-5 lg:pt-3">
                      ${startingPrice}.00
                    </p>
                    <p className="text-lg font-semibold lg:pb-3">
                      On/Off Service:
                    </p>

                    <label className="flex cursor-pointer items-center justify-center">
                      <input
                        type="checkbox"
                        value=""
                        className="peer sr-only"
                      />
                      <span className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></span>
                    </label>
                  </div>
                  <div className="flex gap-4 lg:flex-col lg:gap-8">
                    <Link
                      className="rounded-full bg-b50 p-3 text-2xl !leading-none text-b300"
                      href="/dashboard/edit-service"
                    >
                      <PiPencilSimple />
                    </Link>
                    <button className="rounded-full bg-r50 p-3 text-2xl !leading-none text-r300">
                      <PiTrash />
                    </button>
                    <button className=" rounded-full bg-y50 p-3 text-2xl !leading-none text-y300">
                      <PiNotePencil />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-4 3xl:col-span-3">
          <div className="rounded-xl bg-white">
            <header className="flex items-center justify-between px-4 py-6">
              <p ref={currentDateRef} className="current-date"></p>
              <div className="icons flex gap-2">
                <span
                  id="prev"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full text-2xl !leading-none text-n300 duration-500 hover:bg-r300 hover:text-white"
                  onClick={() => handleIconClick("prev")}
                >
                  <PiCaretLeft />
                </span>

                <span
                  id="next"
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full text-2xl !leading-none text-n300 duration-500 hover:bg-r300 hover:text-white"
                  onClick={() => handleIconClick("next")}
                >
                  <PiCaretRight />
                </span>
              </div>
            </header>

            <div className="calendar p-2 sm:p-5">
              <ul className="weeks flex text-center">
                <li>Sun</li>
                <li>Mon</li>
                <li>Tue</li>
                <li>Wed</li>
                <li>Thu</li>
                <li>Fri</li>
                <li>Sat</li>
              </ul>
              <ul
                ref={daysTagRef}
                className="days mb-5 flex flex-wrap text-center"
              ></ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardServicesPage;
