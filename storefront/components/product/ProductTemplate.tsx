
import serviceDetailsImg from "@/public/images/worker-details-img.png";
import { notFound } from "next/navigation";
import { HttpTypes } from "@medusajs/types";
import ProductTabs from "@/modules/products/components/product-tabs";
import { Suspense } from "react";
import ProductActions from "@/modules/products/components/product-actions";
import ProductActionsWrapper from "@/modules/products/templates/product-actions-wrapper";
import SkeletonRelatedProducts from "@/modules/skeletons/templates/skeleton-related-products";
import RelatedProducts from "./RelatedProducts";
import ThumbnailSelector from "./ThumbnailSelector";
import NewsLetter from "../designEditor/NewsLetter";
import ReportIssueForm from "./ReportIssueForm";
import ProductCreatorInfo from "./ProductCreatorInfo";
import ProductSocialShare from "./ProductSocialShare";

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct;
  region: HttpTypes.StoreRegion;
  countryCode: string;
};

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {


  if (!product || !product.id) {
    return notFound();
  }


  return (
    <>
      <section className="sbp-30 stp-30">
        <div className="container grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="col-span-12">
              <div className="grid grid-cols-12 gap-6">
                {/* ThumbnailSelector takes 60% of the width */}
                <ThumbnailSelector

                  thumbnail={product.thumbnail || serviceDetailsImg.src}
                  images={product.images || []}
                />
                {/* Product description and details take 40% of the width */}
                <div className="col-span-12 md:col-span-5 lg:col-span-4 flex flex-col items-end justify-start">
                  <div className="flex flex-col px-6 items-start justify-start">
                    <h3 className="heading-3 pb-3">{product.title}</h3>
                    <p className="font-medium text-n300">
                      {product.subtitle || product.description}
                    </p>
                  </div>
                  <ProductCreatorInfo product={product} />
                  <div className="flex flex-col w-full justify-start mt-4">
                    <div className="rounded-2xl border border-n30 px-6 py-8 w-full text-center text-n300">
                      <Suspense
                        fallback={
                          <ProductActions
                            disabled={true}
                            product={product}
                            region={region}
                          />
                        }
                      >
                        <ProductActionsWrapper id={product.id} region={region} />
                      </Suspense>
                    </div>

                    {/* Social and Report Section */}
                    <ProductSocialShare />
                  </div>
                </div>
              </div>
            </div>


            {/* Description Section */}
            <div className="col-span-12 lg:col-span-6">
              <div className="stp-15 sbp-15">
                <ProductTabs product={product} />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:order-last">
              <ReportIssueForm product={product} />
            </div>
          </div>
        </div>
        <div className="container">
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </section>
      <NewsLetter />
    </>
  );
}

export default ProductTemplate;

