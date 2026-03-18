import BreadCrumb from "@/components/global/BreadCrumb";
import Pagination from "@/components/ui/Pagination";
import ServiceCard from "@/components/ui/ServiceCard";
import { workerServices } from "@/data/data";

import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import RefinementList from "@/modules/store/components/refinement-list";
import { Suspense } from "react";
import SkeletonProductGrid from "@/modules/skeletons/templates/skeleton-product-grid";
import PaginatedProducts from "@/modules/store/templates/paginated-products";

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: {
    sortBy?: SortOptions
    page?: string
  }
  params: {
    countryCode: string
  }
}

export default async function StorePage({ searchParams, params }: Params) {
  const { sortBy, page } = searchParams
  const sort = sortBy || "created_at"
  const pageNumber = page ? parseInt(page) : 1


  return (
    <>
      <BreadCrumb pageName="All Services" isSearchBoxShow={true} />

      <section className="sbp-30 stp-30">
        <div className="container grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <div className="rounded-xl border border-n30 px-6 py-8">
              <h5 className="heading-5">Filter by</h5>
              <RefinementList sortBy={sort} />
            </div>
          </div>

          <div className="col-span-12 rounded-xl border border-n30 p-4 sm:p-8 lg:col-span-8">

          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={"gb"}
            />
          </Suspense>
            </div>
        </div>
      </section>
    </>
  );
}