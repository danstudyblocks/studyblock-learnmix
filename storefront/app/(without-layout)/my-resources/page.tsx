import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomer, getCustomerProducts } from "@/lib/data/customer";
import MyResourcesPage from "@/components/my-resources/MyResourcesPage";

export default async function MyResources() {
    const authToken = (await cookies()).get("_medusa_jwt")?.value;

    if (!authToken) {
        redirect("/account");
    }

    const customer = await getCustomer();

    if (!customer) {
        redirect("/account");
    }

    // Fetch only products created by this customer
    let products = [];
    try {
        products = await getCustomerProducts();
    } catch (error) {
        console.error('Error loading customer products:', error);
        // Continue with empty products array
    }

    return <MyResourcesPage customer={customer} products={products} />;
}
