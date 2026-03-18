"use client"
import { socialLinks } from "@/data/data";
import Link from "next/link";

const ProductSocialShare: React.FC = () => {
  return (
    <div className="flex flex-col items-start justify-start pt-6">
      <p className="text-sm font-medium text-sbhtext">StudyBlocks</p>
      <p className="pt-1 mb-2 text-sm font-medium">
        Resources from the studyblocks team
      </p>
      <div>
        <p className="text-n600 text-2xl font-[700] text-start">
          <span className="text-sbhtext">Share</span> this <br />
          Resource
        </p>
        <div className="flex items-center justify-start gap-4 mt-2">
          {socialLinks.slice(0, 6).map(({ id, link, icon }) => (
            <Link
              key={id}
              href={link}
              target="_blank"
              className="flex cursor-pointer items-center justify-center rounded-full border border-n700 p-2.5 duration-500 hover:border-b300 hover:bg-b300 hover:text-white"
            >
              <span className="!leading-none">{icon}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSocialShare;
