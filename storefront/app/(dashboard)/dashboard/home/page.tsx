import Home from "@/components/home/Home";
import { getCustomer } from "@/lib/data/customer";
import { listOrders } from "@/lib/data/orders";

async function Homepage() {
  const customer = await getCustomer().catch(() => null);
  const orders = await listOrders()
  return (
    <>
      <Home customer={customer} orders={orders} />
    </>
  );
}

export default Homepage;
