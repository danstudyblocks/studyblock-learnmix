import badge from "@/public/images/verify-badge.png";
import {
  PiCaretLeft,
  PiCaretRight,
  PiHeart,
  PiPaperPlaneTilt,
} from "react-icons/pi";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import settingsIcon from "@/public/images/settings_icon.png";
import tapIcon from "@/public/images/tap_icon.png";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import "swiper/css";
import { getProductsById } from "@/lib/data/products";
import { getProductPrice } from "@/lib/util/get-product-price";
import { Suspense } from "react";
import SkeletonProductGrid from "@/modules/skeletons/templates/skeleton-product-grid";
import NewArrivals from "./NewArrivals";

async function ExpertCard({
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
      <NewArrivals p={p} />
    </Suspense>
  );
}

export default ExpertCard;
