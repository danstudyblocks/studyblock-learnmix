import WorkerPortfolioFooter from "@/components/workers/WorkerPortfolioFooter";
import WorkerPortfolioHeader from "@/components/workers/WorkerPortfolioHeader";
import WorkerPortfolioHero from "@/components/workers/WorkerPortfolioHero";
import { workerPortfolioData } from "@/data/data";
import arrow2 from "@/public/images/big_arrow.png";
import Image from "next/image";
import Link from "next/link";

function WorkerPortfolioDetails() {
  return (
    <>
      <WorkerPortfolioHeader />

      <WorkerPortfolioHero />

      <section className="">
        <div className="stp-30 sbp-30 container">
          <p className="text-2xl font-medium text-n300">
            Our cleaning services portfolio showcases our dedication to pristine
            spaces. From residential deep cleans to commercial sanitization, we
            deliver excellence. Trust us for thorough, efficient cleaning
            solutions tailored to your needs, ensuring a healthier and more
            inviting environment for all.
          </p>
          <p className="py-6 text-2xl font-medium text-n300">
            With a proven track record of transforming spaces, our cleaning
            portfolio highlights our expertise in maintaining cleanliness and
            hygiene.
          </p>
          <p className="text-xl font-medium text-n300 sm:text-2xl">
            Link:
            <Link className="text-n900" href="#">
              http://Servibe.com
            </Link>
          </p>
        </div>

        <div className="stp-15 sbp-15 container flex flex-col items-center justify-center gap-8 border-y-2 border-n900">
          <h2 className="heading-2">Work with me</h2>
          <div className="max-w-[300px]">
            <Link
              href="/chat"
              className="relative block w-full overflow-hidden rounded-full bg-n700 px-6 py-3 text-sm font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)]"
            >
              <div className="relative z-20 flex items-center justify-center gap-3">
                <span>Let&apos;s Chat</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="stp-30 sbp-30" id="services">
        <div className="container grid grid-cols-12 gap-6">
          <h2 className="heading-2 sbp-15 col-span-12">More Services</h2>
          {workerPortfolioData.slice(0, 2).map(({ id, img, name }) => (
            <div className="col-span-12 md:col-span-6" key={id}>
              <div className="overflow-hidden rounded-2xl">
                <Image src={img} alt="" />
              </div>
              <div className="flex items-center justify-between">
                <Link href="/worker-portfolio-details" className="heading-4">
                  {name}
                </Link>
                <Link href="/worker-portfolio-details">
                  <Image src={arrow2} alt="" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <WorkerPortfolioFooter />
    </>
  );
}

export default WorkerPortfolioDetails;
