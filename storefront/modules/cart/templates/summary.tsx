"use client";

import CartTotals from "@modules/common/components/cart-totals";
import Divider from "@modules/common/components/divider";
import DiscountCode from "@modules/checkout/components/discount-code";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { HttpTypes } from "@medusajs/types";
import LinkButton from "@/components/ui/LinkButton";

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[];
  };
};

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address";
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery";
  } else {
    return "payment";
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart);

  return (
    <div className="flex flex-col gap-6 p-4 bg-white border rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Summary</h2>

      {/* Discount code input */}
      {/* <DiscountCode cart={cart} /> */}

      {/* Divider */}
      {/* <Divider /> */}

      {/* Cart totals */}
      <CartTotals totals={cart} />
      <div className="text-white text-base text-center items-center flex justify-center">
      <LinkButton link={"/checkout?step=" + step} text="Go to checkout" isGreen={true} />
      </div>
    </div>
  );
};

export default Summary;
