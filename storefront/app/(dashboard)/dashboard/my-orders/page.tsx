//@ts-nocheck
import DigitalDownloads from "@/components/dashboard/DigitalDownloads"
import PaymentDetails from "@/components/myOrders/PaymentDetails"
import { listOrders } from "@/lib/data/orders"
import { getDigitalProductList } from "@/lib/data/vendor"

const MyOrders = async () => {
  const orders = await listOrders()
  const digitalProducts = await getDigitalProductList()

  return (
    <>
      <PaymentDetails orders={orders} />
      <DigitalDownloads digitalProducts={digitalProducts} />
    </>
  )
}

export default MyOrders