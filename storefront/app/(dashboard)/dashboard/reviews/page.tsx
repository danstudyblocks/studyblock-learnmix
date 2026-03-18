import { PiTwitterLogoFill } from "react-icons/pi";
import Pagination from "@/components/ui/Pagination";
import { loginReviewData } from "@/data/data";
import Image from "next/image";

function ReviewPage() {
  return (
    <section className="mt-[100px] pt-15">
      <div className="4xl:large-container grid grid-cols-12 gap-6 overflow-hidden rounded-2xl bg-white p-4 max-4xl:mx-4 sm:p-10">
        <div className="col-span-12 flex items-center justify-between gap-4">
          <h4 className="heading-4">Customer Reviews</h4>
          <p className="font-medium text-b300 md:text-lg">Showing 8 of 44</p>
        </div>
        {loginReviewData
          .slice(0, 8)
          .map(({ id, review, img, name, profileId }) => (
            <div key={id} className="col-span-12 md:col-span-6">
              <div className="group rounded-3xl border border-n40 p-1 duration-500 hover:border-b300">
                <div className="flex flex-col items-start justify-start gap-6 rounded-3xl border border-n40 p-4 duration-500 group-hover:border-b300 sm:p-8">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center justify-start gap-4">
                      <div className="">
                        <Image src={img} alt="" className="rounded-full" />
                      </div>
                      <div className="">
                        <p className="heading-5">{name}</p>
                        <p className="font-medium text-n500">{profileId}</p>
                      </div>
                    </div>

                    <div className="text-3xl !leading-none text-n300 duration-500 group-hover:text-b300">
                      <PiTwitterLogoFill />
                    </div>
                  </div>
                  <p className="text-lg text-n400 lg:text-xl">{review}</p>
                  <p className="font-medium text-n500">
                    10:01PM. April 07,2024
                  </p>
                </div>
              </div>
            </div>
          ))}
        <div className="col-span-12 flex items-center justify-center pt-8">
          <Pagination />
        </div>
      </div>
    </section>
  );
}

export default ReviewPage;
