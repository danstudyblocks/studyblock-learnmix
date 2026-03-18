import BreadCrumb2 from "@/components/global/BreadCrumb2";
import BlogPostCard from "@/components/ui/BlogPostCard";
import Pagination from "@/components/ui/Pagination";
import { blogDetails } from "@/data/data";

function page() {
  return (
    <>
      <BreadCrumb2 pageName="Blog Page" />

      <section className="sbp-30">
        <div className="container -mt-40 rounded-xl bg-white p-2 sm:p-4 md:rounded-3xl md:p-15 lg:rounded-[60px]">
          <div className="grid grid-cols-12 gap-6">
            {blogDetails.map(({ id, ...props }) => (
              <BlogPostCard key={id} {...props} />
            ))}
          </div>
        </div>

        <div className="container max-lg:pt-8">
          <Pagination />
        </div>
      </section>
    </>
  );
}

export default page;
