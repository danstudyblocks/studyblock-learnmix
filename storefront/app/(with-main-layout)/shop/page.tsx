//@ts-nocheck
import CircleText from "@/components/ui/CircleText";
import PaginationWrapper from "@/components/ui/PaginationWrapper";
import ShopSearchBox from "@/components/ui/ShopSearchBox";
import ShopProductGrid from "@/components/shop/ShopProductGrid";

import { getProductsListWithSort, getProductsById } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { getRegion } from "@lib/data/regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import RefinementList from "@/modules/store/components/refinement-list";
import NewsLetter from "@/components/designEditor/NewsLetter";

const PRODUCT_LIMIT = 20

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

async function ShopPage({
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
    limit: PRODUCT_LIMIT,
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

  const productIds = products.map((p) => p.id)
  const pricedProducts = productIds.length
    ? await getProductsById({ ids: productIds, regionId: region.id })
    : []
  const pricedById = new Map(pricedProducts.map((p) => [p.id, p]))

  const productsWithPrices = products
    .map((product) => {
      const pricedProduct = pricedById.get(product.id)
      if (!pricedProduct) return null
      const { cheapestPrice } = getProductPrice({ product: pricedProduct })
      return {
        id: product.id,
        thumbnail: product.thumbnail ?? "",
        title: product.title ?? "",
        description: product.description ?? "",
        subtitle: product.subtitle ?? "",
        handle: product.handle ?? "",
        images: product.images ?? [],
        region,
        cheapestPrice,
      }
    })
    .filter(Boolean)

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)
  return (
    <>
      <section className="sbp-30 stp-30">
        <h2 className="container sm:heading-2 text-[32px] font-[800] text-n600 max-sm:pr-10">
          Find the <span className="text-sbhtext">Right</span> resource <br />
          for every classroom.
        </h2>
        <div className="container">
          <div className="grid grid-cols-12 gap-4 items-center my-5">
            <div className="col-span-12 lg:col-span-6">
              <ShopSearchBox />
            </div>
          </div>
        </div>

        <div className="container grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3">
            <div className="rounded-xl border border-n30 px-3 py-4">
              <RefinementList sortBy={sortBy} />
            </div>
            <div className="mt-8 mb-10">
              <h3 className="heading-3">Upload a <br /> <span className="text-sbhtext">resource</span></h3>
              <p className="py-4 font-medium text-n500">
                Share and sell your learning <br />
                resources with us, through our <br />
                fully managed marketplace.
              </p>
              <button className="relative flex items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-2 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3">
                <span className="relative z-10">Upload</span>
              </button>
            </div>
            <div className="mt-14 mb-8">
              <h3 className="heading-3">Can’t find what <br /> <span className="text-sbhtext">you’re looking for?</span></h3>
              <p className="py-4 font-medium text-n500">
                Make our resources your own <br />
                with the StudyBlocks designer <br />
                tool. Edit the text, colour, images <br />
                and add your logo in seconds.
              </p>
              <button className="relative flex items-center justify-center overflow-hidden rounded-xl bg-b300 px-4 py-2 font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-xl after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] lg:px-8 lg:py-3">
                <span className="relative z-10">Designer</span>
              </button>
            </div>
            <CircleText />
          </div>

          <div className="col-span-12 lg:col-span-9">
            <ShopProductGrid items={productsWithPrices} />

            <div className="container pt-8">
              <PaginationWrapper currentPage={Number(page)} totalPages={totalPages} />
            </div>
          </div>
        </div>
      </section>
      <NewsLetter />
    </>
  );
}

export default ShopPage;
