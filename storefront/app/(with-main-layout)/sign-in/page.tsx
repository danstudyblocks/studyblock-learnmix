import SignIn from "@/components/account/SignIn"
import { getCustomer, login } from "@lib/data/customer";
import { redirect } from "next/navigation";


const SignInPage = async () => {
  const customer = await getCustomer().catch(() => null);

  if (customer) {
    redirect("/");
  }
  return (
    <>
      <SignIn login={login} />
    </>
  )
}

export default SignInPage