import Link from "next/link";
import { socialLinks } from "../../../data/data";

function FooterTwo() {
  return (
    <section className="stp-30 bg-n900 text-white">
      <div className="4xl:large-container max-4xl:container">
        <div className="">
          <h2 className="display-4 !font-extrabold">Our Mission</h2>
          <p className="pt-6 text-xl">
            Empowering lives through seamless services, driven by innovation and
            trust
          </p>
          <div className="stp-30 sbp-30">
            <ul className="flex items-center justify-start gap-2 max-sm:flex-wrap sm:justify-between md:gap-6">
              {socialLinks.map(({ id, name, link }) => (
                <li
                  key={id}
                  className="relative z-10 flex items-center justify-center overflow-hidden rounded-full border border-eb50/60 py-3 duration-500 after:absolute after:inset-0 after:h-full after:w-full after:-translate-x-full after:rounded-full after:bg-y300 after:duration-700 hover:text-n900 hover:after:translate-x-0 max-sm:px-8 max-sm:text-sm sm:w-full"
                >
                  <Link
                    href={link}
                    className="relative z-20 h-full w-full text-center"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sbp-30">
            <h4 className="lead-text pb-8 font-semibold">Page List</h4>
            <div className="flex flex-wrap items-center justify-between gap-10 font-medium text-n50">
              <ul className="flex min-w-[100px] flex-col gap-3 sm:gap-6">
                <li className="duration-500 hover:text-y300">
                  <Link href="/">Home V1</Link>
                </li>
                <li className="duration-500 hover:text-y300">
                  <Link href="/home-two">Home V2</Link>
                </li>
                <li className="duration-500 hover:text-y300">
                  <Link href="/home-three">Home V3</Link>
                </li>
              </ul>
              <ul className="flex min-w-[100px] flex-col gap-3 sm:gap-6">
                <li className="duration-500 hover:text-y300">
                  <Link href="/home-four">Hove V4</Link>
                </li>
                <li className="duration-500 hover:text-y300">
                  <Link href="/about-us">About</Link>
                </li>
                <li className="duration-500 hover:text-y300">
                  <Link href="/find-workers">Find Worker</Link>
                </li>
              </ul>
              <ul className="flex min-w-[100px] flex-col gap-3 sm:gap-6">
                <li className="duration-500 hover:text-y300">
                  <Link href="/privacy-policy">Privacy</Link>
                </li>
                <li className="duration-500 hover:text-y300">
                  <Link href="/blog">Blog</Link>
                </li>
                <li className="duration-500 hover:text-y300">
                  <Link href="/faq">FAQ</Link>
                </li>
              </ul>
              <ul className="flex min-w-[100px] flex-col gap-3 sm:gap-6">
                <li className="duration-500 hover:text-y300">
                  <Link href="/sign-up">Sign Up</Link>
                </li>
                <li className="duration-500 hover:text-y300">
                  <Link href="/worker-profile">Profile</Link>
                </li>
                <li className="duration-500 hover:text-y300">
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
              <div className="flex flex-col items-start justify-start gap-5 sm:pl-4">
                <p className="text-lg font-medium">
                  Subscribe to our newsletter
                </p>
                <div className="rounded-full border-2 border-white">
                  <input
                    type="text"
                    className="bg-transparent px-2 outline-none placeholder:text-white max-[400px]:w-[175px] min-[400px]:px-4 lg:px-8"
                    placeholder="Enter Email"
                  />
                  <button className="rounded-full border-2 border-white bg-y300 px-2 py-3 font-medium text-n900 sm:px-4 sm:py-4 xl:px-8">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 border-t py-8 font-medium max-sm:flex-col">
        <div className="flex items-center justify-start gap-1 sm:border-r sm:pr-6">
          <p>Designed By</p>
          <Link href="" className="text-g200 underline">
            Pixelaxis
          </Link>
        </div>

        <p>Copyright @ {new Date().getFullYear()} Servibe</p>
      </div>
    </section>
  );
}

export default FooterTwo;
