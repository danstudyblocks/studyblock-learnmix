"use client"
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";

function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const handleClick = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <ul className="flex items-center justify-center gap-2 font-medium text-white sm:gap-3">
      <li
        className="flex cursor-pointer items-center justify-center rounded-full bg-n900 p-[14px] text-xl duration-500 hover:bg-b300"
        onClick={() => handleClick(currentPage - 1)}
      >
        <PiCaretLeft />
      </li>
      {[...Array(totalPages)].map((_, index) => (
        <li
          key={index}
          className={`flex size-12 cursor-pointer items-center justify-center rounded-full ${currentPage === index + 1 ? "bg-b300" : "bg-n900"} duration-500 hover:bg-b300`}
          onClick={() => handleClick(index + 1)}
        >
          {index + 1}
        </li>
      ))}
      <li
        className="flex cursor-pointer items-center justify-center rounded-full bg-n900 p-[14px] text-xl duration-500 hover:bg-b300"
        onClick={() => handleClick(currentPage + 1)}
      >
        <PiCaretRight />
      </li>
    </ul>
  );
}

export default Pagination;
