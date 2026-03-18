import FaqSection from "@/components/aboutUs/FaqSection";
import Testimonial from "@/components/homeTwo/Testimonial";
import WorkerPortfolioFooter from "@/components/workers/WorkerPortfolioFooter";
import WorkerPortfolioHeader from "@/components/workers/WorkerPortfolioHeader";
import WorkerPortfolioHero from "@/components/workers/WorkerPortfolioHero";
import { workerPortfolioData } from "@/data/data";
import arrow2 from "@/public/images/big_arrow.png";
import Image from "next/image";
import Link from "next/link";

function WorkerPortfolio() {
  return (
    <>
      <WorkerPortfolioHeader />

      <WorkerPortfolioHero />

      <section className="stp-30 sbp-30">
        <div className="container grid grid-cols-12 gap-6" id="services">
          {workerPortfolioData.map(({ id, img, name }) => (
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

      <Testimonial />

      <FaqSection />

      <WorkerPortfolioFooter />
    </>
  );
}

export default WorkerPortfolio;
