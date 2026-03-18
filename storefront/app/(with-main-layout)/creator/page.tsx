//@ts-nocheck
import StaggerEffectTwo from "@/components/animation/StaggerEffectTwo";
import CircleText from "@/components/ui/CircleText";
import Pagination from "@/components/ui/Pagination";
import SearchBox from "@/components/ui/SearchBox";
import { socialLinks } from "@/data/data";
import Link from "next/link";
import { PiCaretRight, PiPaperPlaneTilt, PiStarFill } from "react-icons/pi";
import badge from "@/public/images/verify-badge2.png";
import Image from "next/image";
import people1 from "@/public/images/review_people_1.png";
import people2 from "@/public/images/review_people_2.png";
import people3 from "@/public/images/review_people_3.png";
import ShopCard from "@/components/ui/ShopCard";
import { SortOptions } from "@/modules/store/components/refinement-list/sort-products";
import { getProductsListWithSort } from "@/lib/data/products";
import { getRegion } from "@/lib/data/regions";
import NewsLetter from "@/components/designEditor/NewsLetter";


const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

async function CreatorPage({
  collectionId,
  categoryId,
  productsIds,
  searchParams, params
}: {
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  params: {
    countryCode: string
  };
  searchParams: {
    sortBy?: SortOptions;
    page?: string;
  }
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }
  

  const { sortBy = 'created_at', page = 1 } = searchParams



  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion('gb')

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await getProductsListWithSort({
    page: Number(page),
    queryParams,
    sortBy,
    countryCode: "gb",
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)
  return (
    <>
      {/* <BreadCrumb pageName="All Services" isSearchBoxShow={true} /> */}

      <section className="sbp-30 stp-30">
        <h2 className="container sm:heading-2 text-[32px] font-[800] text-n600 max-sm:pr-10">
          <span className="text-sbhtext">StudyBlocks</span>
        </h2>
        <div className="container">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-12 lg:col-span-6">
              <SearchBox />
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="flex flex-row flex-wrap gap-2 px-6 text-lg my-5 lg:my-10">
                <p className="text-n800 font-bold">Popular:</p>
                <p className="rounded-xl bg-r50 px-2 py-1 font-medium text-r300">Postcard</p>
                <p className="rounded-xl bg-g50 px-2 py-1 font-medium text-g400">Achievement</p>
                <p className="rounded-xl bg-g50 px-2 py-1 font-medium text-r300">Books</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container grid grid-cols-12 gap-6">
          <div className="col-span-12 rounded-xl border border-n30 px-6 py-8 lg:col-span-4">
            <div className="flex flex-col items-center justify-center">
              <div className="relative max-md:overflow-hidden">
                <div className="hexagon-styles my-[calc(200px*0.5/2)] h-[calc(200px*0.57736720554273)] w-[200px] rounded-[calc(200px/36.75)] bg-b50 before:rounded-[calc(200px/18.75)] after:rounded-[calc(200px/18.75)]">
                  <div className="absolute -top-11 left-[5px]">
                    <div className="hexagon-styles z-10 my-[calc(190px*0.5/2)] h-[calc(190px*0.57736720554273)] w-[190px] rounded-[calc(190px/50)] bg-b300 before:rounded-[calc(190px/50)] after:rounded-[calc(190px/50)]">
                      <div className="absolute -top-[42px] left-[5px] z-20">
                        <div className="hexagon-styles z-10 my-[calc(180px*0.5/2)] h-[calc(180px*0.57736720554273)] w-[180px] rounded-[calc(180px/50)] bg-b50 before:rounded-[calc(180px/50)] after:rounded-[calc(180px/50)]">
                          <div className="r-hex3 absolute -left-[5px] -top-[43px] z-30 inline-block w-[190px] overflow-hidden">
                            <div className="r-hex-inner3">
                              <div
                                className={`r-hex-inner-3 before:h-[190px] before:bg-cover`}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-5 right-1 z-30">
                  <Image src={badge} alt="" className="" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-6">
                <h4 className="heading-4">
                  Albert Flores
                </h4>
                <div className="flex gap-2">
                  <h5 className="heading-5">Albert Flores</h5>
                  <p className="p rounded-full bg-r300 text-white px-3 py-1 text-sm font-medium">
                    Verified
                  </p>
                </div>
              </div>
              <p className="pt-3 text-center text-sm text-n300">
                Brooklyn, NY, USA
              </p>
              <div className="w-full pt-8 sm:px-12">
                <Link
                  href="/chat"
                  className="relative block w-full overflow-hidden rounded-full bg-n700 px-6 py-3 text-sm font-semibold text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)]"
                >
                  <div className="relative z-20 flex items-center justify-center gap-3">
                    <span className="text-xl !leading-none">
                      <PiPaperPlaneTilt />
                    </span>
                    <span>Get in touch</span>
                  </div>
                </Link>
              </div>

              <div className="mt-5 flex w-full items-center justify-between rounded-xl border border-n30 px-5 py-3">
                <div className="flex items-center justify-start gap-2">
                  <span className=" text-xl !leading-none">
                    <PiStarFill />
                  </span>
                  <p className="font-medium">Write a review</p>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <div className="flex items-center justify-start max-xl:hidden">
                    <Image
                      src={people1}
                      alt=""
                      className="relative -z-10 flex size-7 items-center justify-center overflow-hidden rounded-full bg-g75"
                    />
                    <Image
                      src={people2}
                      alt=""
                      className="-z-9 relative -ml-2 flex size-7 items-center justify-center overflow-hidden rounded-full bg-g75"
                    />
                    <Image
                      src={people3}
                      alt=""
                      className="-z-8 relative -ml-2 flex size-7 items-center justify-center overflow-hidden rounded-full bg-g75"
                    />
                    <p className="-z-7 relative -ml-2 flex size-7 items-center justify-center rounded-full bg-g75">
                      +8
                    </p>
                  </div>
                  <span className="text-xl !leading-none">
                    <PiCaretRight />
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start justify-start gap-3 pt-8">
              <p className="text-sm font-medium">Areas of interest</p>
              <div className="flex flex-wrap gap-1 text-n400">
                <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                  <span>Handyman</span>
                </p>
                <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                  <span>Clening </span>
                </p>
                <p className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">
                  <span>Plumber </span>
                </p>
                <p className="rounded-xl bg-b50 px-3 py-2 font-medium">+3</p>
              </div>
            </div>

            <div className="flex flex-col items-start justify-start gap-3 pt-8">
              <p className="text-sm font-medium">ABOUT</p>
              <p className="text-n300">
                Welcome to Servibe where convenience meets quality. Discover a
                seamless platform connecting you with trusted service providers
                effortlessly.
              </p>
            </div>

            <div className="flex flex-col items-start justify-start gap-3 pt-8">
              <p className="text-sm font-medium">LINKS</p>
              <div className="flex items-center justify-start gap-3">
                {socialLinks.slice(0, 4).map(({ id, link, icon }) => (
                  <Link
                    key={id}
                    href={link}
                    className="flex cursor-pointer items-center justify-center rounded-full border border-n700 p-2.5 duration-500 hover:border-b300 hover:bg-b300 hover:text-white"
                  >
                    <span className="!leading-none">{icon}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-8 flex justify-center items-center">
              <CircleText />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9">
            <div className="grid grid-cols-3 gap-3 !text-xs">

              {products.slice(0, 6).map(({ id, ...product }, idx) => (
                <div key={id}>
                  <StaggerEffectTwo id={idx}>
                    <ShopCard {...product} id={id} region={region} />
                  </StaggerEffectTwo>
                </div>
              ))}

            </div>

            <div className="container pt-8">
              <Pagination currentPage={page} totalPages={totalPages} />
            </div>
          </div>
        </div>
      </section>
      <NewsLetter />
    </>
  );
}

export default CreatorPage;
