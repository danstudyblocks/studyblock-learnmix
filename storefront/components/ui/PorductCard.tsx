import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import settingsIcon from "@/public/images/settings_icon.png";
import tapIcon from "@/public/images/tap_icon.png";
import { HttpTypes } from "@medusajs/types";
import Thumbnail from "@/modules/products/components/thumbnail";
import { getProductsById } from "@/lib/data/products";
import { getProductPrice } from "@/lib/util/get-product-price";
import PreviewPrice from "@/modules/products/components/product-preview/price";

async function ProductCard({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const [pricedProduct] = await getProductsById({
    ids: [product.id!],
    regionId: region.id,
  })

  if (!pricedProduct) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product: pricedProduct,
  })
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-n30 p-3 max-md:flex-col">
      <div className="flex items-center justify-start max-xxl:gap-2 max-sm:flex-col">
        <div className="flex items-center justify-center sm:justify-start self-stretch sm:w-[80%]">
          <div data-testid="product-wrapper" className="h-full w-full">
          <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
          </div>
        </div>
        <div className="">
          <h5 className="heading-5 pb-3 px-3">{product.title}</h5>
          <h5 className="flex items-center justify-center gap-2 rounded-xl bg-b50 px-3 py-2 font-medium">{product.description}</h5>
        </div>
      </div>

      <div className="felx h-full w-full flex-col items-center justify-center rounded-2xl border border-n30 px-6 py-8 text-center text-n300 md:max-w-[176px]">
        <p className="text-sm font-semibold">STARTING AT</p>
        <p className="py-1 font-semibold text-r300">{cheapestPrice && <PreviewPrice price={cheapestPrice} />}</p>
        <Link
          href={`/products/${product.handle}`}
          className="relative flex items-center justify-center overflow-hidden rounded-full bg-b300 px-3 py-2 text-sm font-medium text-white duration-700 after:absolute after:inset-0 after:left-0 after:w-0 after:rounded-full after:bg-yellow-400 after:duration-700 hover:text-n900 hover:after:w-[calc(100%+2px)] lg:px-4 lg:py-3"
        >
          <span className="relative z-10">View Details</span>
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
