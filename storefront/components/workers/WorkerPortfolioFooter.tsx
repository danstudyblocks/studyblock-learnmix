import Link from "next/link";
import { socialLinks } from "../../data/data";

function WorkerPortfolioFooter() {
  return (
    <section className="stp-30 sbp-30 bg-n900">
      <div className="container flex flex-col items-center justify-center text-white">
        <h2 className="heading-2">Let&apos;s Collaborate</h2>
        <div className="flex items-center justify-between gap-3 pt-8 font-medium">
          <Link
            href="/hire-me"
            className="relative flex items-center justify-center overflow-hidden rounded-full bg-b300 px-8 py-3 text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)]"
          >
            <span className="relative z-10"> WORK WITH ME</span>
          </Link>
        </div>
        <ul className="stp-15 sbp-15 flex items-center justify-center gap-10">
          <li>
            <Link href="/worker-profile">Services</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          <li>
            <Link href="/faq">FAQ</Link>
          </li>
        </ul>
        <div className="flex items-center justify-center gap-3 text-2xl">
          {socialLinks.slice(0, 4).map(({ id, icon, link }) => (
            <Link key={id} className="group relative" href={link}>
              <span className=" flex items-center justify-center rounded-full border border-n500 p-4 duration-500 hover:border-v200 hover:text-v200">
                {icon}
              </span>

              <div className="absolute right-1/2 top-1 h-0 w-px bg-v200 duration-500 group-hover:h-2"></div>
              <div className="absolute right-1 top-1/2 h-px w-0 bg-v200 duration-500 group-hover:w-2"></div>

              <div className="absolute bottom-1 right-1/2 h-0 w-px bg-v200 duration-500 group-hover:h-2"></div>

              <div className="absolute left-1 top-1/2 h-px w-0 bg-v200 duration-500 group-hover:w-2"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WorkerPortfolioFooter;
