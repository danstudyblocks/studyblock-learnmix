"use client"
import { useEffect, useState } from "react";
import { HttpTypes } from "@medusajs/types";
import { fetchLinkedCreator } from "@/lib/data/vendor";
import Image from "next/image";
import Link from "next/link";
import badge from "@/public/images/verify-badge.png";

type ProductCreatorInfoProps = {
  product: HttpTypes.StoreProduct;
};

const ProductCreatorInfo: React.FC<ProductCreatorInfoProps> = ({ product }) => {
  const [creator, setCreator] = useState<HttpTypes.StoreCustomer | null>(null);
  const [creatorImg, setCreatorImg] = useState(null);
  const [loadingCreator, setLoadingCreator] = useState(true);
  const [creatorError, setCreatorError] = useState("");

  useEffect(() => {
    const loadCreator = async () => {
      setLoadingCreator(true);
      try {
        const response = await fetchLinkedCreator(product.id);
        if (response.success) {
          setCreator(response.creator);
          setCreatorImg(response.creator?.metadata?.avatar_url);
        } else {
          setCreatorError(response.error || "Unable to fetch creator.");
        }
      } catch {
        setCreatorError("An unexpected error occurred.");
      } finally {
        setLoadingCreator(false);
      }
    };

    if (product.id) {
      loadCreator();
    }
  }, [product.id]);

  return (
    <div className="flex items-center justify-start gap-3 px-3">
      <div className="max-md:overflow-hidden">
        <Link href={`/products/${product.handle}`}>
          {creatorImg ? (
            <Image
              src={creatorImg || badge}
              alt="Creator Img"
              className="w-[48px] h-[48px] rounded-full border-2 border-n700 shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              width={48}
              height={48}
            />
          ) : (
            <Image
              src={badge}
              alt="Creator img"
              className="w-[48px] max-sm:w-[72px]"
            />
          )}
        </Link>
      </div>
      <div className="max-[350px]:max-w-20">
        <div className="flex items-center justify-start gap-3">
          <p className="text-sm font-semibold">
            Creator:{" "}
            {loadingCreator
              ? "Loading..."
              : creator
                ? `${creator.first_name} ${creator.last_name}`
                : "StudyBlocks"}
          </p>
          <p className="rounded-full bg-y300 px-2 py-1 text-xs font-medium">
            PRO
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCreatorInfo;
