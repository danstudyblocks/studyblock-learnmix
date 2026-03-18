"use client";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import AnimateHeight from "react-animate-height";
import { PiPaperPlaneTilt, PiShareFatFill } from "react-icons/pi";

function CommentCard({
  img,
  name,
  date,
  comment,
}: {
  img: StaticImageData;
  name: string;
  date: string;
  comment: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-start justify-start gap-3">
      <div className="min-w-[40px] overflow-hidden rounded-full sm:min-w-[80px]">
        <Image src={img} className="h-full w-full" alt="" />
      </div>

      <div className="">
        <p className="heading-5">{name}</p>
        <p className="pt-1 text-gray-800">
          {date},{new Date().getFullYear()}
        </p>
        <p className="pt-4 text-sm text-n200 sm:pt-6 sm:text-base lg:text-lg">
          {comment}
        </p>
        <button
          className="flex items-center justify-start gap-3 pt-5 text-lg font-semibold"
          onClick={() => setShow((prev) => !prev)}
        >
          <span className="text-2xl !leading-none">
            <PiShareFatFill />
          </span>
          Reply
        </button>

        <AnimateHeight height={show ? "auto" : 0}>
          <div className=" flex items-center justify-start gap-3 overflow-hidden duration-500 pt-2 max-[350px]:flex-col">
            <input
              type="text"
              className="w-full rounded-2xl border border-n30 px-4 py-2 outline-none placeholder:text-n300"
              placeholder="Type your reply"
            />
            <button className="group rounded-xl bg-n900 px-4 py-2 text-2xl !leading-none text-white duration-500 hover:bg-r300 max-[350px]:w-full flex justify-center items-center">
              <span className="block duration-500 group-hover:rotate-45">
                <PiPaperPlaneTilt />
              </span>
            </button>
          </div>
        </AnimateHeight>
      </div>
    </div>
  );
}

export default CommentCard;
