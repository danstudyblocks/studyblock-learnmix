import { PiTwitterLogoFill } from "react-icons/pi";
import { testimonialData } from "../../data/data";
import Image from "next/image";

function Testimonials() {
  return (
    <section className="stp-30 sbp-30 4xl:large-container max-4xl:container">
      <h2 className="display-4 !font-extrabold">Testimonials</h2>
      <div className="stp-15 grid grid-cols-12 gap-6">
        <div className="col-span-12 flex flex-col gap-6 md:col-span-6 lg:col-span-4">
          {testimonialData
            .slice(0, 2)
            .map(({ id, review, img, name, profileId }) => (
              <div className="" key={id}>
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
                      10:01PM. April 07,{new Date().getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="col-span-12 flex flex-col gap-6 md:col-span-6 lg:col-span-4">
          {testimonialData
            .slice(2, 4)
            .map(({ id, review, img, name, profileId }) => (
              <div className="" key={id}>
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
                      10:01PM. April 07,{new Date().getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="col-span-12 flex gap-6 max-md:flex-col lg:col-span-4 lg:flex-col">
          {testimonialData
            .slice(4, 6)
            .map(({ id, review, img, name, profileId }) => (
              <div className="" key={id}>
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
                      10:01PM. April 07,{new Date().getFullYear()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
