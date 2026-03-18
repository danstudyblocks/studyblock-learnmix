import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import { isDigitalCart } from "@lib/util/is-digital-cart"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const isDigital = isDigitalCart(cart)
  const shippingMethods = isDigital ? null : await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!paymentMethods) {
    return null
  }

  return (
    <div>
      <div className="w-full grid grid-cols-1 gap-y-8">
        {!isDigital && (
          <>
            <div>
              <Addresses cart={cart} customer={customer} />
            </div>

            <div>
              <Shipping cart={cart} availableShippingMethods={shippingMethods} />
            </div>
          </>
        )}

        <div>
          <Payment cart={cart} availablePaymentMethods={paymentMethods} isDigital={isDigital} />
        </div>

        <div>
          <Review cart={cart} isDigital={isDigital} />
        </div>
      </div>
    </div>
  )
}
