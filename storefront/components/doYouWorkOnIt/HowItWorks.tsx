import Image from "next/image";
import icon1 from "@/public/images/how_it_works_icon_1.png";
import icon2 from "@/public/images/how_it_works_icon_2.png";
import icon3 from "@/public/images/how_it_works_icon_3.png";

function HowItWorks() {
  return (
    <section className="stp-30 sbp-30 6 bg-n20">
      <div className="4xl:large-container max-4xl:container">
        <h1 className="display-4 text-center !font-extrabold">How It Works</h1>
        <div className="stp-15 flex items-center justify-between gap-6 max-md:flex-col">
          <div className="flex max-w-[520px] flex-col items-center justify-center lg:p-4 xl:p-10">
            <div className="relative rounded-full bg-b300 p-6 lg:p-10">
              <Image src={icon1} alt="" />

              <div className="absolute bottom-0 right-0 size-12 rounded-full bg-white p-1">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-y300 font-bold">
                  <p>01</p>
                </div>
              </div>
            </div>
            <h3 className="heading-3 stp-15">Post a Request</h3>
            <p className="pt-3 text-center text-n500">
              Simply post your request and connect with experts ready to help.
              Your needs our priority. Get started now!
            </p>
          </div>
          <div className="flex max-w-[520px] flex-col items-center justify-center lg:p-4 xl:p-10">
            <div className="relative rounded-full bg-b300 p-6 lg:p-10">
              <Image src={icon2} alt="" />

              <div className="absolute bottom-0 right-0 size-12 rounded-full bg-white p-1">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-y300 font-bold">
                  <p>02</p>
                </div>
              </div>
            </div>
            <h3 className="heading-3 stp-15">Review Offers</h3>
            <p className="pt-3 text-center text-n500">
              Explore enticing reviews discover exclusive offers that elevate
              experience. Your satisfaction is our priority.
            </p>
          </div>
          <div className="flex max-w-[520px] flex-col items-center justify-center lg:p-4 xl:p-10">
            <div className="relative rounded-full bg-b300 p-6 lg:p-10">
              <Image src={icon3} alt="" />

              <div className="absolute bottom-0 right-0 size-12 rounded-full bg-white p-1">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-y300 font-bold">
                  <p>03</p>
                </div>
              </div>
            </div>
            <h3 className="heading-3 stp-15">Get It Done</h3>
            <p className="pt-3 text-center text-n500">
              Achieve your goals effortlessly. Let&apos;s get it done together
              your ambitions realized seamless precision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
