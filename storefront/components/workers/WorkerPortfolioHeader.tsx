"use client";
import Link from "next/link";
import { useState } from "react";
import { PiList, PiPlusBold, PiX } from "react-icons/pi";

function WorkerPortfolioHeader() {
  const [showNav, setShowNav] = useState(false);
  return (
    <header className="header headerAbsolute left-0 right-0 top-0 z-50">
      <div className="max-xxl:container xxl:px-25">
        <div className="text-s1 flex items-center justify-between py-6">
          <div className="flex items-center justify-start gap-3 pb-1">
            <div className="relative">
              <button
                onClick={() => setShowNav((prev) => !prev)}
                className="mobileMenuOpenButton text-3xl md:hidden"
              >
                <PiList />
              </button>
              <div
                className={`absolute top-10 left-0 rounded-xl bg-white  z-[998] p-4 ${
                  showNav
                    ? "visible scale-100 opacity-100"
                    : "invisible scale-0 opacity-0"
                } duration-500 origin-top-left`}
              >
                <ul className="flex flex-col gap-2">
                  <li className=" hover:text-r300 duration-500">
                    <Link href={"#"}>Services</Link>{" "}
                  </li>
                  <li className=" hover:text-r300 duration-500">
                    {" "}
                    <Link href={"#"}>About</Link>{" "}
                  </li>
                  <li className=" hover:text-r300 duration-500">
                    {" "}
                    <Link href={"#"}>FAQ</Link>{" "}
                  </li>
                </ul>
              </div>
            </div>
            <Link href="">
              <h2 className="heading-2">Albert Flores</h2>
            </Link>
          </div>

          <div className="flex items-center justify-between gap-6">
            <ul className="flex items-center justify-start gap-2 font-medium max-md:hidden xxl:gap-6">
              <li className="">
                <Link
                  href="#services"
                  className="rounded-lg px-2 py-3 duration-700"
                >
                  SERVICES
                </Link>
              </li>
              <li className="">
                <Link
                  href="#about"
                  className="rounded-lg px-2 py-3 duration-700"
                >
                  ABOUT
                </Link>
              </li>
              <li className="">
                <Link href="#faq" className="rounded-lg px-2 py-3 duration-700">
                  FAQ
                </Link>
              </li>
            </ul>
            <div className="flex items-center justify-between gap-3 font-medium">
              <Link
                href="/hire-me"
                className="relative flex items-center justify-center overflow-hidden rounded-full bg-b300 text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] max-xxl:size-11 max-xxl:!leading-none xxl:px-8 xxl:py-3"
              >
                <span className="relative z-10 max-xxl:hidden">
                  WORK WITH ME
                </span>
                <span className=" text-xl xxl:hidden">
                  <PiPlusBold />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav className="">
        <div className="mobileMenuBg mobileMenuBgClose fixed left-0 top-0 z-[998] h-full w-full bg-r50 duration-700 lg:hidden"></div>

        <div className="mobileMenu mobileMenuClose fixed left-0 top-0 z-[999] flex h-full w-3/4 flex-col items-start justify-start gap-8 bg-r300 text-white/80 duration-700 min-[500px]:w-1/2 lg:hidden lg:gap-20">
          <div className="fixed top-0 flex w-full items-center justify-between bg-r300 p-4 sm:p-8">
            <Link href="/">
              <h3 className="heading-3">Albert Flores</h3>
            </Link>
            <span className=" cursor-pointer !text-3xl">
              <PiX />
            </span>
          </div>

          <ul className="flex w-full flex-col items-start gap-6 overflow-y-auto pb-10 pl-8 pt-24 text-lg sm:text-xl lg:gap-10">
            <li>
              <Link
                href="#services"
                className="menu-hover hover:after:border-p1"
              >
                Services
              </Link>
            </li>
            <li>
              <Link href="#about" className="menu-hover hover:after:border-p1">
                About
              </Link>
            </li>
            <li>
              <Link href="#faq" className="menu-hover hover:after:border-p1">
                {" "}
                FAQ{" "}
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default WorkerPortfolioHeader;
