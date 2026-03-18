import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"
import TopExperts from "@/components/homeTwo/TopExperts"
import NewsLetter from "@/components/designEditor/NewsLetter"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <>
      <div className="sbp-30 !pb-0 mt-[100px] pt-6">
        <div className="container flex flex-col">
          {cart?.items?.length ? (
            <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
              <div className="flex flex-col bg-white py-6 gap-y-6">
                {!customer && (
                  <>
                    <SignInPrompt />
                    <Divider />
                  </>
                )}
                <ItemsTemplate items={cart?.items} />
              </div>
              <div className="relative">
                <div className="flex flex-col gap-y-8 sticky top-12">
                  {cart && cart.region && (
                    <>
                      <div className="bg-white py-6">
                        <Summary cart={cart as any} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <EmptyCartMessage />
            </div>
          )}
        </div>
      </div>
      {/* <TopExperts /> */}
      <NewsLetter />
    </>
  )
}

export default CartTemplate
