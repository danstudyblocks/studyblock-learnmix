import Image from "next/image";
import arrow from "@/public/images/big_arrow_2.png";

function WorkerPortfolioHero() {
  return (
    <section className="stp-30 sbp-30 mt-[100px] bg-bg2">
      <div
        className="container flex items-center justify-start gap-6 max-md:flex-col md:gap-10 lg:gap-20"
        id="about"
      >
        <div className="max-md:overflow-hidden">
          <div className="hexagon-styles my-[calc(300px*0.5/2)] h-[calc(300px*0.57736720554273)] w-[300px] rounded-[calc(300px/36.75)] bg-b50 before:rounded-[calc(300px/18.75)] after:rounded-[calc(300px/18.75)]">
            <div className="absolute -top-[60px] left-4">
              <div className="hexagon-styles z-10 my-[calc(270px*0.5/2)] h-[calc(270px*0.57736720554273)] w-[270px] rounded-[calc(270px/50)] bg-b300 before:rounded-[calc(270px/50)] after:rounded-[calc(270px/50)]">
                <div className="absolute -top-[55px] left-2.5 z-20">
                  <div className="hexagon-styles z-10 my-[calc(250px*0.5/2)] h-[calc(250px*0.57736720554273)] w-[250px] rounded-[calc(250px/50)] bg-b50 before:rounded-[calc(250px/50)] after:rounded-[calc(250px/50)]">
                    <div className="r-hex3 absolute -left-1.5 -top-[56px] z-30 inline-block w-[260px] overflow-hidden">
                      <div className="r-hex-inner3">
                        <div className="expertImgBig r-hex-inner-3 before:h-[260px] before:bg-cover"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-xl:overflow-hidden">
          <p className="heading-6">Spotless Solutions</p>
          <div className="">
            <h2 className="heading-2 pt-5">
              Albert Flores is a{" "}
              <span className="underline">Cleaning services</span>
            </h2>
            <div className="flex items-center justify-start gap-4 pt-2">
              <Image src={arrow} alt="" />
              <h2 className="heading-2">based in Taiwan</h2>
            </div>
          </div>
          <p className="pt-6 text-base font-medium text-n300 lg:text-xl">
            we are committed to providing top-quality cleaning services tailored
            to meet your specific needs. With years of experience in the
            industry, our team of professional cleaners is dedicated to
            delivering exceptional results.
          </p>
        </div>
      </div>
    </section>
  );
}

export default WorkerPortfolioHero;
