import { PiArrowRight } from "react-icons/pi";
import { blogDetails } from "../../data/data";
import BlogPostCard from "../ui/BlogPostCard";
import Link from "next/link";

function RecentPosts() {
  return (
    <section className="stp-30 sbp-30 bg-n20">
      <div className="4xl:large-container max-4xl:container">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="display-4 font-extrabold text-n900">Recent Posts</h2>
          </div>
          <div className="">
            <Link
              href="/blog"
              className="flex items-center justify-start gap-3 font-bold duration-300 hover:text-b300"
            >
              All Article
              <span className="ph-bold ph-arrow-right text-2xl !leading-none">
                <PiArrowRight />
              </span>
            </Link>
          </div>
        </div>
        <div className="stp-15 grid grid-cols-12 gap-6">
          {blogDetails.slice(0, 4).map(({ id, ...props }) => (
            <BlogPostCard key={id} {...props} isFourItems={true} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecentPosts;
