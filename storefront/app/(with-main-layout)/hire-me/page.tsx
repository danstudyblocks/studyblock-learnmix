import { socialLinks } from "@/data/data";
import workerImg from "@/public/images/review_people_1.png";
import badge from "@/public/images/verify-badge2.png";
import Image from "next/image";
import Link from "next/link";

function page() {
  return (
    <>
      <section className="sbp-30 mt-[140px]">
        <div className="container grid grid-cols-12 gap-6">
          <div className="col-span-12 rounded-2xl border border-n30 p-4 md:col-span-5 lg:p-8">
            <div className="flex items-center justify-center">
              <div className="relative max-md:overflow-hidden">
                <div className="hexagon-styles my-[calc(190px*0.5/2)] h-[calc(190px*0.57736720554273)] w-[190px] rounded-[calc(190px/36.75)] bg-b50 before:rounded-[calc(190px/18.75)] after:rounded-[calc(190px/18.75)]">
                  <div className="absolute -top-[38px] left-2">
                    <div className="hexagon-styles z-10 my-[calc(175px*0.5/2)] h-[calc(175px*0.57736720554273)] w-[175px] rounded-[calc(175px/50)] bg-b300 before:rounded-[calc(175px/50)] after:rounded-[calc(175px/50)]">
                      <div className="absolute -top-[35px] left-2 z-20">
                        <div className="hexagon-styles z-10 my-[calc(160px*0.5/2)] h-[calc(160px*0.57736720554273)] w-[160px] rounded-[calc(160px/50)] bg-b50 before:rounded-[calc(160px/50)] after:rounded-[calc(160px/50)]">
                          <div className="r-hex3 absolute -left-[2px] -top-[34px] z-30 inline-block w-[165px] overflow-hidden">
                            <div className="r-hex-inner3">
                              <div className="expertImgBig r-hex-inner-3 before:h-[160px] before:bg-cover"></div>
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
            </div>
            <div className="flex items-start justify-center gap-3 pt-6">
              <h4 className="heading-4">Albert Flores</h4>
              <p className="p rounded-full bg-y300 px-3 py-1 text-sm font-medium">
                PRO
              </p>
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
                {socialLinks.slice(0, 4).map(({ id, icon, link }) => (
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
          <div className="col-span-12 rounded-2xl border border-n30 p-4 sm:p-6 md:col-span-7 lg:p-10">
            <h5 className="heading-5 w-full border-b border-n30 pb-6">
              Handyman
            </h5>

            <div className="flex flex-col gap-6 pt-6">
              <div className="flex items-center justify-between gap-3 rounded-3xl border border-n30 px-6 py-5">
                <div className="flex items-center justify-start gap-3">
                  <Image
                    src={workerImg}
                    className="w size-12 rounded-full"
                    alt=""
                  />
                  <div className="">
                    <p className="pb-1 font-medium">Jenny Wilson</p>
                    <p className="text-sm text-n300">life blogger</p>
                  </div>
                </div>
                <p className="heading-4">$245</p>
              </div>

              <div className="rounded-2xl border border-n30 bg-n10 px-4 py-3">
                <input
                  type="date"
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <div className="rounded-2xl border border-n30 bg-n10 px-4 py-3">
                <input
                  type="time"
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <div className="rounded-2xl border border-n30 bg-n10 px-4 py-3">
                <textarea
                  placeholder="Message"
                  className="min-h-[150px] w-full bg-transparent outline-none"
                ></textarea>
              </div>
              <button className="relative flex items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-2 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3">
                <span className="relative z-10">Hire Me</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default page;
