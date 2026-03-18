"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  return (
    <div className="w-full">
      <ul className="flex list-inside flex-col gap-8">
        {/* Product Information */}
        <li className="marker:heading-4">
          <span className="heading-3 border-b border-n30 pb-5">Product Information</span>
          <ul className="ml-4 flex list-disc flex-col gap-3 pt-3 text-n300 marker:text-[10px] marker:text-n900">
            <li>
              <strong>Material:</strong> {product.material ? product.material : "-"}
            </li>
            <li>
              <strong>Country of origin:</strong> {product.origin_country ? product.origin_country : "-"}
            </li>
            <li>
              <strong>Type:</strong> {product.type ? product.type.value : "-"}
            </li>
            <li>
              <strong>Weight:</strong> {product.weight ? `${product.weight} g` : "-"}
            </li>
            <li>
              <strong>Dimensions:</strong>{" "}
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </li>
          </ul>
        </li>

        {/* Shipping & Returns */}
        <li className="marker:heading-4">
          <span className="heading-4">Shipping & Returns</span>
          <ul className="ml-4 flex list-disc flex-col gap-3 pt-3 text-n300 marker:text-[10px] marker:text-n900">
            <li>
              <FastDelivery className="inline-block mr-2" />
              <strong>Fast delivery:</strong> Your package will arrive in 3-5 business days at your pick-up location or in the comfort of your home.
            </li>
            <li>
              <Refresh className="inline-block mr-2" />
              <strong>Simple exchanges:</strong> Is the fit not quite right? No worries - we&apos;ll exchange your product for a new one.
            </li>
            <li>
              <Back className="inline-block mr-2" />
              <strong>Easy returns:</strong> Just return your product and we&apos;ll refund your money. No questions asked – we&apos;ll do our best to make sure your return is hassle-free.
            </li>
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default ProductTabs
