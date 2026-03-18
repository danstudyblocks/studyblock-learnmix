import { getCustomer } from "@lib/data/customer"
import HeaderTemplate from "../ui/HeaderTemplate";


const Header = async () => {
  const customer = await getCustomer().catch(() => null);
  return (
    <HeaderTemplate customer={customer} />
  )
}

export default Header