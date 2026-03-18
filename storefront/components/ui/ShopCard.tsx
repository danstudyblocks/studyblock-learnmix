import { getProductsById } from "@/lib/data/products";
import Card from "./Card";
import { getProductPrice } from "@/lib/util/get-product-price";
import { Suspense } from "react";
import SkeletonProductGrid from "@/modules/skeletons/templates/skeleton-product-grid";


async function ShopCard({
  id,
  thumbnail,
  title,
  description,
  subtitle,
  handle,
  images,
  region
}: {
  id: string;
  thumbnail: string;
  title: string;
  description: string;
  subtitle: string;
  handle: string;
  images: any[];
  region: any
}) {

  const [pricedProduct] = await getProductsById({
    ids: [id!],
    regionId: region.id,
  })

  if (!pricedProduct) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product: pricedProduct,
  })

    // Include cheapestPrice in the `p` prop
    const p = { id, thumbnail, title, description, subtitle, handle, images, region, cheapestPrice };

  return (
    <Suspense fallback={<SkeletonProductGrid />}>
      <Card p={p} />
    </Suspense>
  );
}

export default ShopCard;
