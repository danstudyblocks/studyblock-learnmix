import PayoutHistoryComponent from "@/components/payoutHistory/PayoutHistoryComponent"
import { getCustomer } from "@/lib/data/customer";

const payoutHistory = async () => {
    const customer = await getCustomer().catch(() => null);

  return (
    <>
    <PayoutHistoryComponent customer={customer} />
    </>
  )
}

export default payoutHistory