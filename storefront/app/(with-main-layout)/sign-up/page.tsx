import SignIn from "@/components/account/SignIn"
import SignUp from "@/components/account/SignUp";
import { getCustomer, signup } from "@lib/data/customer";
import { redirect } from "next/navigation";


const SignInPage = async() => {
  const customer = await getCustomer().catch(() => null);

  if (customer) {
    redirect("/");
  }
  return (
    <>
    <SignUp signup={signup} />
    </>
  )
}

export default SignInPage