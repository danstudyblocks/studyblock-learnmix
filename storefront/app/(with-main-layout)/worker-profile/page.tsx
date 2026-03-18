"use client";
import BreadCrumb from "@/components/global/BreadCrumb";
import ServiceCard from "@/components/ui/ServiceCard";
import {
  moreProjectData,
  recommendationsData,
  socialLinks,
  topExperts,
  workerServices,
} from "@/data/data";
import people1 from "@/public/images/review_people_1.png";
import people2 from "@/public/images/review_people_2.png";
import people3 from "@/public/images/review_people_3.png";
import settingIcon from "@/public/images/settings_icon.png";
import starIcon from "@/public/images/star_icon.png";
import tapIcon from "@/public/images/tap_icon.png";
import badge2 from "@/public/images/verify-badge.png";
import badge from "@/public/images/verify-badge2.png";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PiCaretRight,
  PiClock,
  PiPaperPlaneTilt,
  PiStarFill,
} from "react-icons/pi";

const tabButton = ["Services", "Works", "Jobs", "Recommendations"];

function WorkerDynamicProfile() {
  const [activeTab, setActiveTab] = useState("Services");

  const { name } = useParams();
  const [bodyData, setBodyData] = useState(Object);

  useEffect(() => {
    const blogData = topExperts.filter(
      (expert) =>
        expert.expertName.toLocaleLowerCase().replaceAll(" ", "-") === name
    );

    setBodyData(blogData[0]);
  }, []);
  return (
    <>
      <BreadCrumb pageName="Worker Profile" />
      <section className="sbp-30 stp-30">
        <div className="container grid grid-cols-12 gap-6">
          <div className="col-span-12 rounded-xl border border-n30 px-6 py-8 lg:col-span-4">
            <div className="flex flex-col items-center justify-center">
              <div className="relative max-md:overflow-hidden">
                <div className="hexagon-styles my-[calc(200px*0.5/2)] h-[calc(200px*0.57736720554273)] w-[200px] rounded-[calc(200px/36.75)] bg-b50 before:rounded-[calc(200px/18.75)] after:rounded-[calc(200px/18.75)]">
                  <div className="absolute -top-11 left-[5px]">
                    <div className="hexagon-styles z-10 my-[calc(190px*0.5/2)] h-[calc(190px*0.57736720554273)] w-[190px] rounded-[calc(190px/50)] bg-b300 before:rounded-[calc(190px/50)] after:rounded-[calc(190px/50)]">
                      <div className="absolute -top-[42px] left-[5px] z-20">
                        <div className="hexagon-styles z-10 my-[calc(180px*0.5/2)] h-[calc(180px*0.57736720554273)] w-[180px] rounded-[calc(180px/50)] bg-b50 before:rounded-[calc(180px/50)] after:rounded-[calc(180px/50)]">
                          <div className="r-hex3 absolute -left-[5px] -top-[43px] z-30 inline-block w-[190px] overflow-hidden">
                            <div className="r-hex-inner3">
                              <div
                                className={`${
                                  bodyData !== undefined
                                    ? bodyData.img
                                    : "expertImgBig"
                                } r-hex-inner-3 before:h-[190px] before:bg-cover`}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-5 right-1 z-30">
                  <Image src={badge} alt="" className="" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-6">
                <h4 className="heading-4">
                  {bodyData !== undefined
                    ? bodyData.expertName
                    : "Albert Flores"}
                </h4>
                <p className="p rounded-full bg-y300 px-3 py-1 text-sm font-medium">
                  PRO
                </p>
              </div>
              <p className="pt-3 text-center text-sm text-n300">
                Brooklyn, NY, USA
              </p>
              <div className="w-full pt-8 sm:px-12">
                <Link
                  href="/chat"
                  className="relative block w-full overflow-hidden rounded-full bg-n700 px-6 py-3 text-sm font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)]"
                >
                  <div className="relative z-20 flex items-center justify-center gap-3">
                    <span className="text-xl !leading-none">
                      <PiPaperPlaneTilt />
                    </span>
                    <span>Get in touch</span>
                  </div>
                </Link>
              </div>

              <Link
                href="/worker-portfolio"
                className="mt-5 flex w-full items-center justify-between rounded-xl border border-n30 px-5 py-3"
              >
                <p className="font-semibold">View My Portfolio</p>
                <span className="text-xl !leading-none">
                  <PiCaretRight />
                </span>
              </Link>

              <div className="mt-5 flex w-full items-center justify-between rounded-xl border border-n30 px-5 py-3">
                <div className="flex items-center justify-start gap-2">
                  <span className=" text-xl !leading-none">
                    <PiStarFill />
                  </span>
                  <p className="font-medium">Recommended</p>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <div className="flex items-center justify-start max-xl:hidden">
                    <Image
                      src={people1}
                      alt=""
                      className="relative -z-10 flex size-7 items-center justify-center overflow-hidden rounded-full bg-g75"
                    />
                    <Image
                      src={people2}
                      alt=""
                      className="-z-9 relative -ml-2 flex size-7 items-center justify-center overflow-hidden rounded-full bg-g75"
                    />
                    <Image
                      src={people3}
                      alt=""
                      className="-z-8 relative -ml-2 flex size-7 items-center justify-center overflow-hidden rounded-full bg-g75"
                    />
                    <p className="-z-7 relative -ml-2 flex size-7 items-center justify-center rounded-full bg-g75">
                      +8
                    </p>
                  </div>
                  <span className="text-xl !leading-none">
                    <PiCaretRight />
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-3 pt-8">
              <p className="text-sm font-medium">RATE</p>
              <p className="rounded-full bg-r50 px-3 py-1 text-[13px] text-r300">
                $75 - &100/hr
              </p>
            </div>

            <div className="flex flex-col items-start justify-start gap-3 pt-8">
              <p className="text-sm font-medium">SERVICES</p>
              <div className="flex flex-wrap gap-1 text-n400">
                <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                  <span>Handyman</span>
                </p>
                <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                  <span>Clening </span>
                </p>
                <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                  <span>Plumber </span>
                </p>
                <p className="rounded-xl bg-b50 px-3 py-2 font-medium">+3</p>
              </div>
            </div>

            <div className="flex flex-col items-start justify-start gap-3 pt-8">
              <p className="text-sm font-medium">BADGES</p>
              <div className="flex flex-wrap gap-1 text-n400">
                <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                  <Image src={settingIcon} alt="" />
                  <span>Cleaning Expert</span>
                </p>
                <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                  <Image src={tapIcon} alt="" />
                  <span>Best Plumber</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start justify-start gap-3 pt-8">
              <p className="text-sm font-medium">ABOUT</p>
              <p className="text-n300">
                Welcome to Servibe where convenience meets quality. Discover a
                seamless platform connecting you with trusted service providers
                effortlessly.
              </p>
            </div>

            <div className="flex flex-col items-start justify-start gap-3 pt-8">
              <p className="text-sm font-medium">LINKS</p>
              <div className="flex items-center justify-start gap-3">
                {socialLinks.slice(0, 4).map(({ id, link, icon }) => (
                  <Link
                    key={id}
                    href={link}
                    className="flex cursor-pointer items-center justify-center rounded-full border border-n700 p-2.5 duration-500 hover:border-b300 hover:bg-b300 hover:text-white"
                  >
                    <span className="!leading-none">{icon}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-12 rounded-xl border border-n30 p-4 sm:p-8 lg:col-span-8">
            <h3 className="heading-3">
              Elevating Cleanliness Standards with Professional Cleaning
              Services
            </h3>
            <p className="text-bg-n300 pt-3 font-medium">
              Elevate cleanliness standards with our professional cleaning
              services. Experience spotless spaces and impeccable results every
              time you book with us.
            </p>

            <div className="flex flex-col gap-4 pt-10">
              <ul className="flex items-center justify-start gap-5 border-b border-n30 pb-5 text-n100 max-md:flex-wrap">
                {tabButton.map((item, idx) => (
                  <li
                    onClick={() => setActiveTab(item)}
                    className={`heading-5 cursor-pointer ${
                      activeTab === item ? "text-n900" : ""
                    } hover:text-n900 duration-500`}
                    key={idx}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              {activeTab === "Services" && (
                <div className="flex flex-col gap-5">
                  {workerServices.map(({ id, ...props }) => (
                    <ServiceCard key={id} {...props} />
                  ))}
                </div>
              )}

              {activeTab === "Works" && (
                <div className="flex flex-col gap-4 pt-8">
                  {workerServices.map(({ id, name, img }) => (
                    <div
                      key={id}
                      className="flex items-start justify-start gap-3 rounded-2xl border border-n30 p-3 max-md:flex-col"
                    >
                      <div className="flex items-center justify-start gap-6 max-sm:flex-col">
                        <div className="flex items-center justify-center self-stretch">
                          <Image
                            src={img}
                            alt=""
                            className="rounded-2xl object-cover"
                          />
                        </div>
                        <div className="">
                          <h5 className="heading-5">{name}</h5>
                          <div className="flex max-w-[350px] flex-wrap gap-1 pt-3 text-sm text-n400 xxl:pt-6">
                            <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                              <Image
                                src="./assets@/public/images/settings_icon.png"
                                alt=""
                              />
                              <span>Handyman</span>
                            </p>
                            <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                              <Image
                                src="./assets@/public/images/tap_icon.png"
                                alt=""
                              />
                              <span>Cleaning</span>
                            </p>
                            <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                              <Image
                                src="./assets@/public/images/tap_icon.png"
                                alt=""
                              />
                              <span>Plumber</span>
                            </p>
                            <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                              <span>+4</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "Jobs" && (
                <>
                  <div className="flex flex-col items-start justify-start gap-4 border-b border-n30 pb-4">
                    <h5 className="heading-5">
                      Social Media Manager for Passionate Studio
                    </h5>
                    <div className="flex items-center justify-start gap-3 text-sm font-medium text-n300">
                      <p className="rounded-full border border-n300 px-5 py-2">
                        Social Media Manager
                      </p>
                      <p className="rounded-full border border-n300 px-5 py-2">
                        Web Developer
                      </p>
                    </div>
                    <div className="flex items-center justify-start gap-6">
                      <p className="flex items-center justify-start gap-2 text-sm font-medium text-n500">
                        <PiClock /> Duration:Ongoing• 20 hrs/wk
                      </p>
                      <p className="rounded-full border border-n30 px-5 py-1 text-sm text-n300">
                        $75 - $100/hr
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium text-n300">
                    <button className=" ">Not interested</button>
                    <Link
                      href="#"
                      className="rounded-full border border-n30 px-5 py-2"
                    >
                      View job Posting
                    </Link>
                  </div>
                </>
              )}

              {activeTab === "Recommendations" && (
                <>
                  {recommendationsData.map(
                    ({ id, profileImg, name, address, review }) => (
                      <div
                        key={id}
                        className="rounded-2xl border border-n30 p-10"
                      >
                        <div className="flex items-center justify-start gap-3 pb-2">
                          <div className="relative max-md:overflow-hidden">
                            <div className="hexagon-styles my-[calc(100px*0.5/2)] h-[calc(100px*0.57736720554273)] w-[100px] rounded-[calc(100px/36.75)] bg-b50 before:rounded-[calc(100px/18.75)] after:rounded-[calc(100px/18.75)]">
                              <div className="absolute -top-[20px] left-[5px]">
                                <div className="hexagon-styles z-10 my-[calc(90px*0.5/2)] h-[calc(90px*0.57736720554273)] w-[90px] rounded-[calc(90px/50)] bg-b300 before:rounded-[calc(90px/50)] after:rounded-[calc(90px/50)]">
                                  <div className="absolute -top-[18px] left-[4px] z-20">
                                    <div className="hexagon-styles z-10 my-[calc(82px*0.5/2)] h-[calc(82px*0.57736720554273)] w-[82px] rounded-[calc(82px/50)] bg-b50 before:rounded-[calc(82px/50)] after:rounded-[calc(82px/50)]">
                                      <div className="r-hex3 absolute -left-0.5 -top-[18px] z-30 inline-block w-[86px] overflow-hidden">
                                        <div className="r-hex-inner3">
                                          <div
                                            className={`r-hex-inner-3 before:h-[86px] before:bg-cover ${profileImg}`}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="absolute bottom-3 right-1 z-30">
                              <Image src={badge2} alt="" className="" />
                            </div>
                          </div>
                          <div className="">
                            <div className="flex items-center justify-start gap-3">
                              <h5 className="heading-5">{name}</h5>
                            </div>
                            <p className="pt-2 text-n500">{address}</p>
                          </div>
                        </div>
                        <p className="flex items-center justify-start gap-3 text-sm text-n300">
                          <Image src={starIcon} alt="" />
                          Luka recommends working with Alice
                        </p>
                        <p className="pt-3 font-medium text-n300">{review}</p>
                      </div>
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="sbp-30">
        <div className="container">
          <div className="flex flex-col items-center justify-center">
            <div className="relative max-md:overflow-hidden">
              <div className="hexagon-styles my-[calc(100px*0.5/2)] h-[calc(100px*0.57736720554273)] w-[100px] rounded-[calc(100px/36.75)] bg-b50 before:rounded-[calc(100px/18.75)] after:rounded-[calc(100px/18.75)]">
                <div className="absolute -top-[20px] left-[5px]">
                  <div className="hexagon-styles z-10 my-[calc(90px*0.5/2)] h-[calc(90px*0.57736720554273)] w-[90px] rounded-[calc(90px/50)] bg-b300 before:rounded-[calc(90px/50)] after:rounded-[calc(90px/50)]">
                    <div className="absolute -top-[18px] left-[4px] z-20">
                      <div className="hexagon-styles z-10 my-[calc(82px*0.5/2)] h-[calc(82px*0.57736720554273)] w-[82px] rounded-[calc(82px/50)] bg-b50 before:rounded-[calc(82px/50)] after:rounded-[calc(82px/50)]">
                        <div className="r-hex3 absolute -left-0.5 -top-[18px] z-30 inline-block w-[86px] overflow-hidden">
                          <div className="r-hex-inner3">
                            <div className="expertImg4 r-hex-inner-3 before:h-[86px] before:bg-cover"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-3 right-1 z-30">
                <Image src={badge2} alt="" className="" />
              </div>
            </div>
            <p className="heading-4 pt-3 text-center">
              Partner With Albert Flores
            </p>
            <div className="max-w-[300px] pt-8">
              <Link
                href="/services"
                className="relative block w-full overflow-hidden rounded-full bg-n700 px-6 py-3 text-sm font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)]"
              >
                <div className="relative z-20 flex items-center justify-center gap-3">
                  <span>View Services</span>
                </div>
              </Link>
            </div>
            <div className="relative flex w-full items-center justify-center pt-7">
              <span className="bg-white px-3 text-center text-sm font-medium">
                More Projects by Albert Flores
              </span>
              <div className="absolute left-0 right-0 top-[38px] -z-10 h-px w-full bg-n30"></div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 pt-8">
            {moreProjectData.map(({ id, img, name }) => (
              <div
                key={id}
                className="col-span-6 rounded-xl border border-n30 p-3 sm:col-span-4 lg:col-span-2"
              >
                <div className="flex items-center justify-center">
                  <Image src={img} className="rounded-3xl" alt="" />
                </div>
                <p className="pt-5 text-center text-sm font-semibold">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default WorkerDynamicProfile;
