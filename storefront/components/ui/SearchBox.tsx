import { PiMagnifyingGlass } from "react-icons/pi";
import LocationModal from "./LocationModal";
import ServiceModal from "./ServiceModal";

function SearchBox() {
  return (
    <div className="w-full rounded-3xl border border-sbhtext bg-white p-2">
      <form className="flex items-center justify-between text-lg font-medium max-sm:text-sm">
        <div className="flex items-center justify-start gap-4 sm:gap-10">
          <LocationModal />
          <ServiceModal />
        </div>
        <button className="relative ml-2 flex items-center justify-center overflow-hidden rounded-full bg-b300 text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] max-xxl:!leading-none max-md:size-11 md:px-8 md:py-3">
          <span className=" text-base !leading-none sm:text-xl md:hidden">
            {" "}
            <PiMagnifyingGlass />{" "}
          </span>
          <span className="relative z-10 max-md:hidden text-lg">Search</span>
        </button>
      </form>
    </div>
  );
}

export default SearchBox;
