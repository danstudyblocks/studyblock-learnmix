//@ts-nocheck
import { PiArrowRightBold } from "react-icons/pi";
import { getProductsListWithSort } from "@lib/data/products";
import StaggerEffectTwo from "../animation/StaggerEffectTwo";
import Link from "next/link";
import { getRegion } from "@/lib/data/regions";
import ExpertCard from "../ui/ExpertCard";

const PRODUCT_LIMIT = 6;

async function NewArrivals({
  isBgGray,
  isThree,
}: {
  isBgGray?: boolean;
  isThree?: boolean;
}) {
  const queryParams = {
    limit: PRODUCT_LIMIT,
    order: "created_at", // Sort by created_at for new arrivals
  };


  const region = await getRegion('gb')

  if (!region) {
    return null
  }

  // Fetch the new products (new arrivals)
  const { response: { products } } = await getProductsListWithSort({
    page: 1, // You can use pagination if needed
    queryParams,
    sortBy: "created_at", // Sort products by created_at
    countryCode: "gb", // Adjust the country code if necessary
  });

  return (
    <section className={`stp-30 sbp-30 ${isBgGray ? "bg-n20" : ""}`}>
      <div className="container">
        <div className="flex items-center justify-between gap-2">
          <div className="flex max-w-[400px] flex-col">
            <h2 className="heading-2 font-bold text-n900">
              New <span className="text-b300 underline">Resources</span>
            </h2>
            <p className="pt-4 font-medium text-sbtext">
              from our growing community of creators.
            </p>
          </div>
          <div>
            <Link
              href="/shop"
              className="flex items-center justify-start gap-3 font-bold duration-300 hover:text-b300"
            >
              View all
              <PiArrowRightBold className="text-2xl !leading-none" />
            </Link>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-3 gap-3 !text-xs">
            {products.slice(0, 6).map(({ id, ...product }, idx) => (
              <div key={id}>
                <StaggerEffectTwo id={idx}>
                  <ExpertCard {...product} id={id} region={region} />
                </StaggerEffectTwo>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewArrivals;
