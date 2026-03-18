"use client";

import Link from "next/link";
import { dashboardProfileLink } from "../../data/data";
import useClickOutside from "../../hooks/useClickOutside";
import Image from "next/image";
import { HttpTypes } from "@medusajs/types";

interface DashboardProfileLinkModalProps {
  avatarUrl: string | null;
  customer: HttpTypes.StoreCustomer;
}

function DashboardProfileLinkModal({ avatarUrl, customer }: DashboardProfileLinkModalProps) {
  const { modal, setModal, modalRef } = useClickOutside();

  return (
    <div
      onClick={() => setModal((prev) => !prev)}
      ref={modalRef}
      className="relative cursor-pointer rounded-full bg-n30 p-px"
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl} 
          className="size-11 rounded-full"
          alt="User Avatar"
          width={44} 
          height={44}
        />
      ) : (
        <div className="size-11 rounded-full bg-b300 flex items-center justify-center">
          <span className="text-white text-lg font-bold">
            {customer?.first_name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
      )}
      <div
        className={`absolute rtl:left-0 ltr:right-0 top-12 w-[200px] origin-top-right rounded-2xl border border-n30 bg-white py-4 duration-500 ${
          modal
            ? "visible scale-100 opacity-100"
            : "invisible scale-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-3 rtl:pr-4 ltr:pl-4">
          {dashboardProfileLink.map(({ id, name, link }) => (
            <li key={id} className="font-medium duration-500 hover:text-r300">
              <Link href={link}>{name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DashboardProfileLinkModal;
