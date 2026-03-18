import LinkButton from "@/components/ui/LinkButton";
import Link from "next/link";

const EmptyCartMessage = () => {
  return (
    <div
      className="flex flex-col justify-center items-start py-48 px-4"
      data-testid="empty-cart-message"
    >
      <h1 className="text-3xl font-semibold mb-2">Cart</h1>
      <p className="text-base mt-4 mb-6 max-w-3xl">
        You don&apos;t have anything in your cart. Let&apos;s change that, use
        the link below to start browsing our products.
      </p>
      <div>
        <div className="text-sm text-white">
          <LinkButton link="/shop" text="Return to shop" isGreen={true} />
        </div>
      </div>
    </div>
  );
};

export default EmptyCartMessage;
