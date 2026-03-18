import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomer } from "@/lib/data/customer";
import { getProductsList } from "@/lib/data/products";
import FavouritesPage from "@/components/favourites/FavouritesPage";

export default async function Favourites() {
    const authToken = (await cookies()).get("_medusa_jwt")?.value;

    if (!authToken) {
        redirect("/account");
    }

    const customer = await getCustomer();

    if (!customer) {
        redirect("/account");
    }

    const countryCode = "gb";

    const queryParams = {
        order: "-created_at",
        limit: 100,
    };

    // Fetch all products
    const products = await getProductsList({ queryParams, countryCode }).then(
        ({ response }) => response.products
    ).catch(() => []);

    // TODO: Filter products based on customer's favorites
    // For now, we'll pass all products and filter on client side based on localStorage
    // In production, you should have a backend endpoint that returns only favorited products

    return <FavouritesPage customer={customer} products={products} />;
}
