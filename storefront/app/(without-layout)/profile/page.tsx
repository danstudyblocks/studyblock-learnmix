import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomer } from "@/lib/data/customer";
import ProfilePage from "@/components/profile/ProfilePage";

export default async function Profile() {
    const authToken = (await cookies()).get("_medusa_jwt")?.value;

    if (!authToken) {
        redirect("/account");
    }

    const customer = await getCustomer();

    if (!customer) {
        redirect("/account");
    }

    return <ProfilePage customer={customer} />;
}
