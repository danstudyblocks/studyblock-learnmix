"use client";

import { PiBell } from "react-icons/pi";
import { dashborarNotificationData } from "@/data/data";
import useClickOutside from "@/hooks/useClickOutside";

function DashboardNotioficationModal() {
  const { modal, setModal, modalRef } = useClickOutside();
  return (
    <div
      onClick={() => setModal((prev) => !prev)}
      ref={modalRef}
      className="relative flex cursor-pointer items-center justify-center rounded-full bg-n30 p-3 text-n300"
    >
      <span className="text-2xl !leading-none">
        <PiBell />
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-n50 p-px">
        <span className="block size-2.5 rounded-full bg-r300"></span>
      </span>

      <div
        className={`absolute rtl:left-0 ltr:right-0 top-12 w-[230px] origin-top-right rounded-2xl border border-n30 bg-white py-4 duration-500 ${
          modal
            ? "visible scale-100 opacity-100"
            : "invisible scale-0 opacity-0"
        }`}
      >
        <p className="px-4 pb-3 text-lg font-semibold">Notification</p>
        <div className="flex w-full flex-col items-start justify-start gap-4 border-y border-n30 p-3">
          {dashborarNotificationData.map(({ id, name, time }) => (
            <div key={id} className="flex items-start justify-start gap-2">
              <span className=" flex items-center justify-center rounded-full bg-b300 p-2 text-white">
                <PiBell />
              </span>
              <div className="">
                <p className="text-n900">{name}</p>
                <p className="text-sm text-n300">{time}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="px-4 pt-3 text-lg font-semibold">See All Notification</p>
      </div>
    </div>
  );
}

export default DashboardNotioficationModal;
