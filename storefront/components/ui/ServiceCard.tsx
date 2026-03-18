import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import settingsIcon from "@/public/images/settings_icon.png";
import tapIcon from "@/public/images/tap_icon.png";

function ServiceCard({
  img,
  name,
  startingPrice,
}: {
  img: StaticImageData;
  name: string;
  startingPrice: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-n30 p-3 max-md:flex-col">
      <div className="flex items-center justify-start max-xxl:gap-2 max-sm:flex-col">
        <div className="flex items-center justify-center sm:justify-start self-stretch sm:w-[80%]">
          <Image src={img} alt="" className="rounded-2xl object-cover" />
        </div>
        <div className="">
          <h5 className="heading-5">{name}</h5>
          <div className="flex flex-wrap gap-1 pt-3 text-sm text-n400 xxl:pt-6">
            <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
              <Image src={settingsIcon} alt="" />
              <span>Handyman</span>
            </p>
            <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
              <Image src={tapIcon} alt="" />
              <span>Cleaning</span>
            </p>
            <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
              <Image src={tapIcon} alt="" />
              <span>Plumber</span>
            </p>
            <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
              <span>+4</span>
            </p>
          </div>
        </div>
      </div>

      <div className="felx h-full w-full flex-col items-center justify-center rounded-2xl border border-n30 px-6 py-8 text-center text-n300 md:max-w-[176px]">
        <p className="text-sm font-semibold">STARTING AT</p>
        <p className="py-1 font-semibold text-r300">{startingPrice}</p>
        <p className="pb-5 text-sm font-semibold">Fixed Price</p>
        <Link
          href="/services/service-details"
          className="relative flex items-center justify-center overflow-hidden rounded-full bg-b300 px-3 py-2 text-sm font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] lg:px-4 lg:py-3"
        >
          <span className="relative z-10">View Details</span>
        </Link>
      </div>
    </div>
  );
}

export default ServiceCard;
