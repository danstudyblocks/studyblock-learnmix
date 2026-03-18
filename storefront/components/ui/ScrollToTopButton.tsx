"use client";
import { useEffect, useState } from "react";
import { PiArrowUp } from "react-icons/pi";

export default function ScrollToTopButton() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    document.addEventListener("scroll", () => {
      if (window.scrollY > 200) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    });
  }, []);
  const backtoTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={`fixed ${
        scrolled ? " bottom-12 sm:bottom-16" : "-bottom-40"
      } text-white text-xl sm:text-2xl rounded-full bg-b300  border border-p1 hover:bg-y300 hover:text-n900 right-6 md:right-10 p-2 sm:p-3  z-40 jumping1 duration-700`}
      onClick={backtoTop}
      aria-label="bottom to top button"
    >
      <span className=" block">
        <PiArrowUp />
      </span>
    </button>
  );
}
