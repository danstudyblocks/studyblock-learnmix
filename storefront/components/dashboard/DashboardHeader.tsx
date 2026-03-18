"use client";
import { useEffect, useState } from "react";
import { PiList, PiX } from "react-icons/pi";
import { dashboardMenu } from "../../data/data";
import DashboardNotioficationModal from "../ui/DashboardNotioficationModal";
import DashboardProfileLinkModal from "../ui/DashboardProfileLinkModal";
import logo from "@/public/images/learnmix.png";
import logoWhite from "@/public/images/logo_white.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { HttpTypes } from "@medusajs/types";

interface DashboardHeaderProps {
  signout: () => Promise<void>;
  customer: HttpTypes.StoreCustomer, 
}


function DashboardHeader({ signout, customer }: DashboardHeaderProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const path = usePathname();
  const [avatar_url, setAvatarUrl] = useState("")

  
  const handleLogout = async () => {
    await signout()
  }

  useEffect(()=> {
    const avatarUrl = customer.metadata?.avatar_url
    //@ts-ignore
    setAvatarUrl(avatarUrl)
  },[customer])

  return (
    <header className="header headerAbsolute left-0 right-0 top-0 z-50 bg-white">
      <div className="4xl:large-container max-4xl:container">
        <div className="text-s1 flex items-center justify-between py-6">
          <div className="flex items-center justify-start gap-3 pb-1">
            <button
              onClick={() => setShowMobileMenu(true)}
              className="mobileMenuOpenButton text-3xl lg:hidden"
            >
              <PiList />
            </button>
            <Link href={"/dashboard/home"}>
              <Image
                src={logo}
                alt="Studyblock logo"
                className="max-w-[110px] min-[400px]:max-sm:max-w-[150px] sm:max-w-[200px]"
              />
            </Link>
          </div>
          <nav className="max-lg:hidden">
            <ul className="flex items-center justify-center gap-2 font-medium xxl:gap-6">
              {dashboardMenu.map(({ id, name, link }) => (
                <li className="" key={id} onClick={name === "Logout" ? handleLogout : undefined}>
                  <Link
                    href={link}
                    className={`${
                      path === link ? "text-b300" : ""
                    } rounded-full px-3 py-2 duration-500 hover:bg-b300 hover:text-white`}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-2 sm:gap-6">
            <DashboardNotioficationModal />
            <DashboardProfileLinkModal avatarUrl={avatar_url || null} customer={customer} />
          </div>
        </div>
      </div>

      <nav className="">
        <div
          className={`${
            showMobileMenu
              ? "translate-y-0  opacity-30 "
              : " translate-y-[-100%] delay-500 opacity-0 "
          } fixed left-0 top-0 z-[998] h-full w-full bg-r50 duration-700 lg:hidden`}
          onClick={() => setShowMobileMenu(false)}
        ></div>

        <div
          className={`fixed left-0 top-0 z-[999] flex h-full w-3/4 flex-col items-start justify-start gap-8 bg-r300 text-white/80 duration-700 min-[500px]:w-1/2 lg:hidden lg:gap-20 ${
            showMobileMenu
              ? "translate-y-0 delay-500 opacity-100  visible"
              : " translate-y-[100%] opacity-50 invisible"
          }`}
        >
          <div className="fixed top-0 flex w-full items-center justify-between bg-r300 p-4 sm:p-8">
            <Link href={"/dashboard/home"}>
              <Image src={logoWhite} alt="logo" className="w-[150px]" />
            </Link>
            <button
              onClick={() => setShowMobileMenu(false)}
              className=" cursor-pointer !text-3xl"
            >
              <PiX />
            </button>
          </div>

          <ul className="flex w-full flex-col items-start gap-6 overflow-y-auto pb-10 pl-8 pt-24 text-lg sm:text-xl lg:gap-10">
            {dashboardMenu.map(({ id, name, link }) => (
              <li key={id}>
                <Link
                  href={link}
                  className={`${path === link ? "underline" : ""}`}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default DashboardHeader;
