"use client";
import FaqSection from "@/components/aboutUs/FaqSection";
import BreadCrumb2 from "@/components/global/BreadCrumb2";
import contactImg from "@/public/images/contact_img.png";
import { PiChatFill, PiMapPinFill, PiPhoneCallFill } from "react-icons/pi";

import emailjs from "@emailjs/browser";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

function ContactPage() {
  const [message, setMessage] = useState(false);
  const form = useRef<HTMLFormElement | null>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(true);
    emailjs.sendForm(
      "YOUR_SERVICE_ID",
      "YOUR_TEMPLATE_ID",
      //@ts-ignore
      form.current,
      {
        publicKey: "YOUR_PUBLIC_KEY",
      }
    );
  };

  setTimeout(() => {
    setMessage(() => false);
  }, 3000);
  return (
    <>
      <BreadCrumb2 pageName="Contact Us" />

      <section className="">
        <div className="container -mt-40 rounded-xl bg-white p-2 sm:p-4 md:rounded-3xl xl:rounded-[60px] xl:p-15">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 flex flex-col items-center justify-center rounded-3xl border border-n30 p-6 md:col-span-4 lg:p-10">
              <div className="flex items-center justify-center rounded-full bg-b300/5 p-5 text-4xl !leading-none text-b300">
                <PiChatFill />
              </div>
              <h4 className="heading-4 pt-6">Chat to support</h4>
              <p className="pb-6 text-sm font-medium text-n300">
                Speak to our friendly team.
              </p>
              <Link href="mailto:support@servibe.com" className="font-medium">
                support@servibe.com
              </Link>
            </div>
            <div className="col-span-12 flex flex-col items-center justify-center rounded-3xl border border-n30 p-6 md:col-span-4 lg:p-10">
              <div className="flex items-center justify-center rounded-full bg-b300/5 p-5 text-4xl !leading-none text-b300">
                <PiMapPinFill />
              </div>
              <h4 className="heading-4 pt-6">Visit us</h4>
              <p className="pb-6 text-sm font-medium text-n300">
                Visit our office HQ.
              </p>
              <Link href="mailto:support@servibe.com" className="font-medium">
                View on Google Maps
              </Link>
            </div>
            <div className="col-span-12 flex flex-col items-center justify-center rounded-3xl border border-n30 p-6 md:col-span-4 lg:p-10">
              <div className="flex items-center justify-center rounded-full bg-b300/5 p-5 text-4xl !leading-none text-b300">
                <PiPhoneCallFill />
              </div>
              <h4 className="heading-4 pt-6">Contact Us</h4>
              <p className="pb-6 text-sm font-medium text-n300">
                Mon-Fri from 8am to 5pm.
              </p>
              <Link href="mailto:support@servibe.com" className="font-medium">
                (239) 555-0108
              </Link>
            </div>
          </div>

          <div className="stp-15 grid grid-cols-12 gap-6">
            <div className="col-span-12 flex items-center justify-center self-stretch overflow-hidden rounded-3xl md:col-span-4">
              <Image src={contactImg} alt="" className="h-full rounded-3xl" />
            </div>
            <div className="col-span-12 rounded-3xl border border-n30 p-4 md:col-span-8 lg:p-15">
              <h3 className="heading-3 sbp-15 text-center">Get in touch</h3>
              <form
                ref={form}
                onSubmit={sendEmail}
                className="grid grid-cols-12 gap-4 font-medium sm:gap-6"
              >
                <div className="col-span-12 rounded-xl border border-n30 p-3 lg:col-span-6">
                  <input
                    type="text"
                    className="outline-none placeholder:text-n100"
                    placeholder="Name"
                    name="user_name"
                    required
                  />
                </div>
                <div className="col-span-12 rounded-xl border border-n30 p-3 lg:col-span-6">
                  <input
                    type="text"
                    className="outline-none placeholder:text-n100"
                    placeholder="Email"
                    required
                    name="user_email"
                  />
                </div>
                <div className="col-span-12 rounded-xl border border-n30 p-3">
                  <textarea
                    className="min-h-[100px] w-full outline-none placeholder:text-n100"
                    placeholder="Message"
                    required
                  ></textarea>
                </div>
                <p className="col-span-12 hidden"></p>
                <div className="col-span-4">
                  <button
                    type="submit"
                    className="relative flex items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-3 font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] sm:px-8"
                  >
                    <span className="relative z-10">Submit</span>
                  </button>
                </div>
                <div className="col-span-12">
                  {message && (
                    <h2 className="text-base lg:text-xl font-bold text-b300 text-center">
                      Message Send Successfully
                    </h2>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="">
        <div className="container px-2 sm:px-4 xl:px-15">
          <FaqSection />
        </div>
      </section>
    </>
  );
}

export default ContactPage;
