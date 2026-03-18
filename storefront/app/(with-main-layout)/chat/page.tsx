"use client";
import { useState } from "react";
import {
  PiChecks,
  PiDotsThreeOutlineFill,
  PiGif,
  PiImage,
  PiList,
  PiMagnifyingGlass,
  PiPaperPlaneTiltBold,
  PiPhone,
  PiSmiley,
  PiVideoCamera,
  PiXCircle,
} from "react-icons/pi";
import { chatList } from "@/data/data";
import userAvatar from "@/public/images/chat1.png";
import Image from "next/image";

function ChatPage() {
  const [toggle, setToggle] = useState(false);
  return (
    <section className="sbp-30">
      <div className="container grid grid-cols-12 border border-primary-20  rounded-xl lg:rounded-2xl  mt-24 sm:mt-28  shadow-[0px_4px_26px_0px_rgba(222,222,222,0.25)]">
        <div
          className={`lg:col-span-3 max-lg:absolute  py-8 border-r bg-white ${
            toggle
              ? "max-lg:translate-x-0 max-lg:visible max-lg:z-10"
              : "max-lg:translate-x-[-100%] max-lg:invisible "
          } duration-500`}
        >
          <div className="flex justify-between items-center px-6 pb-5">
            <div className="flex justify-start items-center gap-3 ">
              <Image
                src={userAvatar}
                alt=" user avatar"
                className="rounded-xl w-12 h-12 shadow-[0px_4px_9px_0px_rgba(100,218,255,0.39)]"
              />
              <h5 className="heading-5">Chat</h5>
            </div>
            <div className="flex justify-end items-center gap-2">
              <span className=" text-2xl bg-slate-100 px-2 rounded-xl block  cursor-pointer">
                <PiDotsThreeOutlineFill />
              </span>
              <span
                className="text-2xl  block lg:hidden cursor-pointer"
                onClick={() => setToggle(false)}
              >
                <PiXCircle />
              </span>
            </div>
          </div>
          <div className="flex justify-start items-center bg-slate-100 gap-2 py-3 px-5 rounded-xl mx-6">
            <span className="block text-slate-400 text-xl">
              <PiMagnifyingGlass />
            </span>
            <input
              placeholder="Search"
              className="outline-none bg-transparent w-full"
            />
          </div>
          <div className="flex flex-col max-h-[460px] overflow-auto pt-5">
            {chatList.map(
              ({
                id,
                name,
                img,
                isNew,
                newMessage,
                lastMessageTime,
                myReply,
              }) => (
                <div
                  className="py-5 px-2 flex justify-start gap-3 items-center pl-6 cursor-pointer hover:bg-primary-20"
                  key={id}
                >
                  <Image
                    src={img}
                    alt={name}
                    className="rounded-xl w-12 h-12"
                  />
                  <div className="">
                    <div className="flex justify-start items-center gap-2 pb-1">
                      <p>{name}</p>
                      {isNew && (
                        <p className="text-sm font-medium text-white px-1.5 py-1 !leading-none rounded-full bg-p1">
                          3
                        </p>
                      )}
                    </div>
                    <div className=" text-sm flex justify-start items-center">
                      {isNew ? (
                        <p>{newMessage}</p>
                      ) : (
                        <p className="text-slate-400">{myReply}</p>
                      )}
                      <p className="flex justify-start items-center pl-2">
                        <span className="w-2 h-2 block rounded-full bg-slate-300"></span>
                        <span className="block pl-1 !leading-none text-t88">
                          {lastMessageTime}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-9">
          <div className="flex justify-between items-center px-4 sm:px-6 py-5 bg-slate-100 border-b">
            <div className="flex justify-start items-center gap-2">
              <i
                className=" lg:hidden text-2xl"
                onClick={() => setToggle(true)}
              >
                <PiList />
              </i>
              <Image
                src={userAvatar}
                alt="user avatar"
                className="rounded-xl w-12 h-12 shadow-[0px_4px_9px_0px_rgba(100,218,255,0.39)]"
              />
              <div>
                <p className="xl-body">Piter Maio</p>
                <p className="text-sm text-[#1ED400]">online</p>
              </div>
            </div>
            <div className="flex">
              <span className=" text-xl text-s1 pr-3 cursor-pointer">
                <PiPhone />
              </span>
              <span className="text-xl text-s1 cursor-pointer">
                <PiVideoCamera />
              </span>
            </div>
          </div>
          <div className="p-6 flex justify-between items-center flex-col gap-7">
            <div className="flex justify-start items-start gap-2 w-full ">
              <Image
                src={userAvatar}
                alt="user avatar"
                className="w-10 h-10 rounded-xl"
              />
              <div className="py-3 px-5 rounded-b-xl rounded-tr-xl bg-slate-200">
                <p className="text-base text-slate-700">
                  Hello! Have you seen my backpack anywhere in office?
                </p>
                <p className="text-sm text-slate-400">15:42</p>
              </div>
            </div>
            <div className="flex justify-start flex-row-reverse items-end gap-2 w-full ">
              <Image
                src={userAvatar}
                alt="user avatar"
                className="w-10 h-10 rounded-xl"
              />
              <div className="py-3 px-5 rounded-b-xl rounded-tr-xl bg-b300 text-white">
                <p className="text-base ">Thank you for work, see you!</p>
                <p className="text-sm text-white/50 flex justify-start items-center">
                  <span className="pr-1">
                    <PiChecks />
                  </span>
                  15:42
                </p>
              </div>
            </div>
            <div className="flex justify-start items-start gap-2 w-full ">
              <Image
                src={userAvatar}
                alt="user avatar"
                className="w-10 h-10 rounded-xl"
              />
              <div className="py-3 px-5 rounded-b-xl rounded-tr-xl bg-slate-200">
                <p className="text-base text-slate-700 max-w-[500px]">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                </p>
                <p className="text-sm text-slate-400">15:42</p>
              </div>
            </div>
            <div className="flex justify-start flex-row-reverse items-end gap-2 w-full ">
              <Image
                src={userAvatar}
                alt="user avatar"
                className="w-10 h-10 rounded-xl"
              />
              <div className="py-3 px-5 rounded-b-xl rounded-tr-xl bg-b300 text-white">
                <p className="text-base ">A page when looking at its layout.</p>
                <p className="text-sm text-white/50 flex justify-start items-center">
                  <span className="pr-1">
                    <PiChecks />
                  </span>
                  15:40
                </p>
              </div>
            </div>
          </div>

          <div className="mx-6 mb-7 rounded-xl px-4 pb-5 max-lg:md:pt-3 lg:rounded-2xl">
            <div className="flex items-center justify-between gap-4 pt-2 max-md:flex-col lg:pt-6">
              <div className="">
                <Image
                  alt="user pic"
                  className="max-w-[60px] rounded-xl object-cover max-md:hidden"
                  src={userAvatar}
                />
              </div>
              <div className="flex w-full items-center justify-between gap-4 rounded-xl bg-[#F6F5F8] p-4 max-md:flex-col lg:rounded-2xl">
                <input
                  className="w-full bg-transparent outline-none"
                  placeholder="Write a comment...."
                />
                <div className="text-t88 flex items-center justify-between gap-1 text-2xl max-md:hidden xl:gap-3">
                  <div className="cursor-pointer">
                    <label htmlFor="chat-file-file">
                      <span className="ph ph-image cursor-pointer">
                        <PiImage />
                      </span>
                    </label>
                    <input className="hidden" id="chat-file-file" type="file" />
                  </div>
                  <button className="ph ph-gif">
                    <PiGif />
                  </button>
                  <button className="ph ph-smiley">
                    <PiSmiley />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-end gap-4 max-md:w-full">
                <div className="text-t88 flex items-center justify-between gap-3 text-2xl md:hidden">
                  <div className="cursor-pointer">
                    <label htmlFor="chat-file">
                      <span className="ph ph-image cursor-pointer">
                        <PiImage />
                      </span>
                    </label>
                    <input className="hidden" id="chat-file" type="file" />
                  </div>
                  <button className="ph ph-gif">
                    <PiGif />
                  </button>
                  <button className="ph ph-smiley">
                    <PiSmiley />
                  </button>
                </div>
                <button className="l-body rounded-xl bg-n900 px-6 py-2 text-2xl !leading-none text-white duration-500 hover:bg-r300 md:px-8 md:py-4">
                  <PiPaperPlaneTiltBold />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChatPage;
