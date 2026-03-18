import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { PiArrowUpRight } from "react-icons/pi";

type PropsData = {
  img: StaticImageData;
  category: string;
  title: string;
  isFourItems?: boolean;
};

function BlogPostCard({ img, category, title, isFourItems }: PropsData) {
  return (
    <div
      className={`group col-span-12 sm:col-span-6  ${
        isFourItems ? "lg:col-span-6 xxl:col-span-3" : "lg:col-span-4"
      }`}
    >
      <div className="relative">
        <Image src={img} alt="" className="w-full rounded-xl" />
        <p className="absolute bottom-3 left-3 rounded-2xl bg-b75 px-6 py-2 text-sm">
          {category}
        </p>
      </div>
      <div className="rounded-2xl bg-r50 px-6 py-5 duration-500 group-hover:bg-bg2">
        <Link href={`/blog/${title.toLowerCase().replaceAll(" ", "-")}`}>
          <h4 className="heading-4 pb-3">{title}</h4>
        </Link>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-n500">
            Latest News April <br />
            12, {new Date().getFullYear()}
          </p>
          <Link
            href={`/blog/${title.toLowerCase().replaceAll(" ", "-")}`}
            className="flex items-center justify-center rounded-full bg-n900 p-2 text-2xl !leading-none text-white duration-500 group-hover:rotate-45"
          >
            <PiArrowUpRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BlogPostCard;
